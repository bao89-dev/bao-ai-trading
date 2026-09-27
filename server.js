require("dotenv").config();

const express = require("express");

const { normalizeSignal } = require("./core/signal-normalizer");
const { analyzeSignal } = require("./core/signal-analyzer");
const { makeDecision } = require("./core/decision-engine");

const app = express();

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.TRADINGVIEW_SECRET;

// ============================================================
// EXPRESS CONFIG
// ============================================================

app.use(express.json({ limit: "1mb" }));

// ============================================================
// BẢO AI TRADING V2
// SIGNAL VALIDATION + RISK + ANALYSIS + DECISION
//
// MODE:
// TEST / PAPER
//
// EXNESS EXECUTION:
// DISABLED
//
// PIPELINE:
//
// TradingView / Manual Signal
//          ↓
//     Webhook Auth
//          ↓
//     Signal Normalizer
//          ↓
//    Instrument Check
//          ↓
//      Validation
//          ↓
//     Risk / Reward
//          ↓
//    Signal Analyzer
//          ↓
//    Decision Engine
//          ↓
//       PAPER
//          ↓
//    Execution Disabled
//
// ============================================================

// ============================================================
// ALLOWED SIGNALS
// ============================================================

const ALLOWED_SIGNALS = ["BUY", "SELL"];

const ALLOWED_TIMEFRAMES = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "4h",
  "1D"
];

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Bao AI Trading",
    version: "V2",
    mode: "TEST",
    message: "Bao AI Trading V2 is running"
  });
});

// ============================================================
// SIGNAL VALIDATION
// ============================================================

function validateSignal(signal) {
  const errors = [];

  if (!signal || typeof signal !== "object") {
    errors.push("Invalid JSON signal");
    return errors;
  }

  // ----------------------------------------------------------
  // SYMBOL
  // ----------------------------------------------------------

  if (!signal.symbol || typeof signal.symbol !== "string") {
    errors.push("Missing symbol");
  }

  // ----------------------------------------------------------
  // SIGNAL
  // ----------------------------------------------------------

  if (!ALLOWED_SIGNALS.includes(signal.signal)) {
    errors.push("Signal must be BUY or SELL");
  }

  // ----------------------------------------------------------
  // TIMEFRAME
  // ----------------------------------------------------------

  if (!ALLOWED_TIMEFRAMES.includes(signal.timeframe)) {
    errors.push(
      "Invalid timeframe. Allowed: " +
      ALLOWED_TIMEFRAMES.join(", ")
    );
  }

  // ----------------------------------------------------------
  // SCORE
  // ----------------------------------------------------------

  if (
    typeof signal.score !== "number" ||
    signal.score < 0 ||
    signal.score > 100
  ) {
    errors.push("Score must be between 0 and 100");
  }

  // ----------------------------------------------------------
  // ENTRY
  // ----------------------------------------------------------

  if (typeof signal.entry !== "number") {
    errors.push("Missing or invalid entry");
  }

  // ----------------------------------------------------------
  // STOP LOSS
  // ----------------------------------------------------------

  if (typeof signal.stop_loss !== "number") {
    errors.push("Missing or invalid stop_loss");
  }

  // ----------------------------------------------------------
  // TAKE PROFIT 1
  // ----------------------------------------------------------

  if (typeof signal.take_profit_1 !== "number") {
    errors.push("Missing or invalid take_profit_1");
  }

  return errors;
}

// ============================================================
// RISK / REWARD CALCULATOR
// ============================================================

function calculateRiskReward(signal) {
  const {
    signal: direction,
    entry,
    stop_loss,
    take_profit_1,
    take_profit_2
  } = signal;

  let risk;
  let reward1;
  let reward2 = null;

  // ----------------------------------------------------------
  // BUY
  // ----------------------------------------------------------

  if (direction === "BUY") {
    risk = entry - stop_loss;

    reward1 = take_profit_1 - entry;

    if (typeof take_profit_2 === "number") {
      reward2 = take_profit_2 - entry;
    }
  }

  // ----------------------------------------------------------
  // SELL
  // ----------------------------------------------------------

  if (direction === "SELL") {
    risk = stop_loss - entry;

    reward1 = entry - take_profit_1;

    if (typeof take_profit_2 === "number") {
      reward2 = entry - take_profit_2;
    }
  }

  // ----------------------------------------------------------
  // INVALID RISK
  // ----------------------------------------------------------

  if (
    typeof risk !== "number" ||
    !Number.isFinite(risk) ||
    risk <= 0
  ) {
    return {
      valid: false,
      risk,
      reward1,
      reward2,
      rr1: null,
      rr2: null
    };
  }

  // ----------------------------------------------------------
  // RR CALCULATION
  // ----------------------------------------------------------

  const rr1 = reward1 / risk;

  const rr2 =
    reward2 !== null
      ? reward2 / risk
      : null;

  return {
    valid: true,

    risk: Number(risk.toFixed(5)),

    reward1:
      Number.isFinite(reward1)
        ? Number(reward1.toFixed(5))
        : null,

    reward2:
      reward2 !== null && Number.isFinite(reward2)
        ? Number(reward2.toFixed(5))
        : null,

    rr1:
      Number.isFinite(rr1)
        ? Number(rr1.toFixed(2))
        : null,

    rr2:
      rr2 !== null && Number.isFinite(rr2)
        ? Number(rr2.toFixed(2))
        : null
  };
}

// ============================================================
// WEBHOOK
// ============================================================

app.post("/webhook", (req, res) => {

  // ==========================================================
  // WEBHOOK AUTHENTICATION
  // ==========================================================

  const incomingSecret = req.headers["x-webhook-secret"];

  if (
    !incomingSecret ||
    incomingSecret !== WEBHOOK_SECRET
  ) {
    return res.status(401).json({
      status: "unauthorized",
      message: "Invalid webhook secret"
    });
  }

  console.log("");
  console.log("========================================");
  console.log("📡 WEBHOOK RECEIVED");
  console.log("========================================");

  console.log("Raw signal:");
  console.log(req.body);

  // ==========================================================
  // RAW SIGNAL
  // ==========================================================

  const signal = req.body;

  // ==========================================================
  // STEP 1
  // SIGNAL NORMALIZATION
  // ==========================================================

  const normalizedResult = normalizeSignal(signal);

  if (!normalizedResult.success) {

    console.log("");
    console.log("❌ NORMALIZATION FAILED");

    console.log(normalizedResult.errors);

    return res.status(400).json({
      status: "rejected",
      mode: "TEST",
      stage: "normalization",
      errors: normalizedResult.errors
    });
  }

  const normalizedSignal = normalizedResult.signal;

  console.log("");
  console.log("✅ SIGNAL NORMALIZED");

  console.log(normalizedSignal);

  // ==========================================================
  // STEP 2
  // VALIDATION
  // ==========================================================

  const errors = validateSignal(normalizedSignal);

  if (errors.length > 0) {

    console.log("");
    console.log("❌ SIGNAL REJECTED");

    console.log("VALIDATION ERRORS:");
    console.log(errors);

    return res.status(400).json({
      status: "rejected",
      mode: "TEST",
      stage: "validation",
      errors
    });
  }

  console.log("");
  console.log("✅ SIGNAL VALIDATION PASSED");

  // ==========================================================
  // STEP 3
  // RISK / REWARD
  // ==========================================================

  const riskReward =
    calculateRiskReward(normalizedSignal);

  console.log("");
  console.log("📊 RISK / REWARD");

  console.log(riskReward);

  // ----------------------------------------------------------
  // INVALID RISK
  // ----------------------------------------------------------

  if (!riskReward.valid) {

    console.log("");
    console.log("❌ INVALID RISK STRUCTURE");

    return res.status(400).json({
      status: "rejected",
      mode: "TEST",
      stage: "risk_reward",
      message: "Invalid risk structure",
      risk_reward: riskReward
    });
  }

  // ==========================================================
  // STEP 4
  // MINIMUM SCORE
  // ==========================================================

  const minimumScore = 80;

  if (normalizedSignal.score < minimumScore) {

    console.log("");
    console.log("⏸️ SIGNAL WAITING");

    console.log(
      `Score ${normalizedSignal.score} < minimum ${minimumScore}`
    );

    return res.json({
      status: "waiting",
      mode: "TEST",
      stage: "score_filter",

      message:
        "Signal score is below minimum threshold",

      received_score:
        normalizedSignal.score,

      minimum_score:
        minimumScore,

      signal: normalizedSignal,

      risk_reward:
        riskReward
    });
  }

  // ==========================================================
  // STEP 5
  // MINIMUM RR
  // ==========================================================

  const minimumRR = 1.5;

  if (
    riskReward.rr1 === null ||
    riskReward.rr1 < minimumRR
  ) {

    console.log("");
    console.log("❌ SIGNAL REJECTED");

    console.log(
      `RR1 ${riskReward.rr1} < minimum ${minimumRR}`
    );

    return res.status(400).json({

      status: "rejected",

      mode: "TEST",

      stage: "risk_reward",

      message:
        "Risk/Reward ratio is below minimum",

      rr1:
        riskReward.rr1,

      minimum_rr:
        minimumRR,

      signal:
        normalizedSignal,

      risk_reward:
        riskReward
    });
  }

  // ==========================================================
  // STEP 6
  // SIGNAL ANALYZER
  // ==========================================================

  const analysisResult =
    analyzeSignal(
      normalizedSignal,
      riskReward
    );

  if (!analysisResult.success) {

    console.log("");
    console.log("❌ SIGNAL ANALYSIS FAILED");

    console.log(
      analysisResult.errors
    );

    return res.status(400).json({

      status: "rejected",

      mode: "TEST",

      stage: "analysis",

      errors:
        analysisResult.errors
    });
  }

  // ==========================================================
  // ANALYSIS LOG
  // ==========================================================

  console.log("");
  console.log("========================================");
  console.log("🧠 SIGNAL ANALYSIS");
  console.log("========================================");

  console.log(
    "Decision:",
    analysisResult.analysis.decision
  );

  console.log(
    "Confidence:",
    analysisResult.analysis.confidence
  );

  console.log(
    "Risk Level:",
    analysisResult.analysis.risk.level
  );

  console.log(
    "Reasons:",
    analysisResult.analysis.reasons
  );

  console.log(
    "Warnings:",
    analysisResult.analysis.warnings
  );

  // ==========================================================
  // STEP 7
  // DECISION ENGINE
  // ==========================================================

  const decisionResult =
    makeDecision(
      analysisResult,
      normalizedSignal
    );

  if (!decisionResult.success) {

    console.log("");
    console.log("❌ DECISION ENGINE FAILED");

    console.log(
      decisionResult.errors
    );

    return res.status(400).json({

      status: "rejected",

      mode: "TEST",

      stage: "decision",

      errors:
        decisionResult.errors
    });
  }

  // ==========================================================
  // DECISION LOG
  // ==========================================================

  console.log("");
  console.log("========================================");
  console.log("🧠 DECISION ENGINE");
  console.log("========================================");

  console.log(
    "Action:",
    decisionResult.decision.action
  );

  console.log(
    "Confidence:",
    decisionResult.decision.confidence
  );

  console.log(
    "Risk Level:",
    decisionResult.decision.riskLevel
  );

  console.log(
    "Reason Codes:",
    decisionResult.decision.reasonCodes
  );

  // ==========================================================
  // STEP 8
  // SIGNAL ACCEPTED
  // ==========================================================

  console.log("");
  console.log("========================================");
  console.log("🟢 SIGNAL ACCEPTED");
  console.log("========================================");

  console.log(
    "Symbol:",
    normalizedSignal.symbol
  );

  console.log(
    "Timeframe:",
    normalizedSignal.timeframe
  );

  console.log(
    "Signal:",
    normalizedSignal.signal
  );

  console.log(
    "Score:",
    normalizedSignal.score
  );

  console.log(
    "Entry:",
    normalizedSignal.entry
  );

  console.log(
    "SL:",
    normalizedSignal.stop_loss
  );

  console.log(
    "TP1:",
    normalizedSignal.take_profit_1
  );

  console.log(
    "TP2:",
    normalizedSignal.take_profit_2
  );

  console.log(
    "RR1:",
    riskReward.rr1
  );

  // ==========================================================
  // STEP 9
  // RESPONSE
  // ==========================================================

  return res.json({

    status: "accepted",

    mode: "TEST",

    signal: normalizedSignal,

    risk_reward:
      riskReward,

    analysis:
      analysisResult.analysis,

    decision:
      decisionResult.decision,

    execution: {

      exness: false,

      order_sent: false,

      message:
        "Signal accepted. Exness execution is disabled in V2."
    }
  });
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {

  console.error("");
  console.error("========================================");
  console.error("❌ SERVER ERROR");
  console.error("========================================");

  console.error(err);

  return res.status(500).json({

    status: "error",

    mode: "TEST",

    message:
      "Internal server error"
  });
});

// ============================================================
// SERVER START
// ============================================================

app.listen(PORT, () => {

  console.log("");
  console.log("========================================");
  console.log("🚀 BAO AI TRADING V2");
  console.log("========================================");

  console.log(
    "Server running on port " + PORT
  );

  console.log(
    "Mode: TEST"
  );

  console.log(
    "Trading mode: PAPER"
  );

  console.log(
    "Exness execution: DISABLED"
  );

  console.log(
    "AI Analyzer: RULE-BASED"
  );

  console.log(
    "Decision Engine: ENABLED"
  );

  console.log("========================================");
  console.log("");
});
