const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ================================
// BẢO AI TRADING V2
// Signal validation engine
// TEST MODE - CHƯA ĐẶT LỆNH EXNESS
// ================================

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

// ================================
// HEALTH CHECK
// ================================

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Bao AI Trading",
    version: "V2",
    mode: "TEST",
    message: "Bao AI Trading V2 is running"
  });
});

// ================================
// SIGNAL VALIDATION
// ================================

function validateSignal(signal) {
  const errors = [];

  if (!signal || typeof signal !== "object") {
    errors.push("Invalid JSON signal");
    return errors;
  }

  // Symbol
  if (!signal.symbol || typeof signal.symbol !== "string") {
    errors.push("Missing symbol");
  }

  // BUY / SELL
  if (!ALLOWED_SIGNALS.includes(signal.signal)) {
    errors.push("Signal must be BUY or SELL");
  }

  // Timeframe
  if (!ALLOWED_TIMEFRAMES.includes(signal.timeframe)) {
    errors.push(
      "Invalid timeframe. Use 1m, 3m, 5m, 15m, 30m, 1h, 4h or 1D"
    );
  }

  // Score
  if (
    typeof signal.score !== "number" ||
    signal.score < 0 ||
    signal.score > 100
  ) {
    errors.push("Score must be between 0 and 100");
  }

  // Entry
  if (typeof signal.entry !== "number") {
    errors.push("Missing or invalid entry");
  }

  // Stop Loss
  if (typeof signal.stop_loss !== "number") {
    errors.push("Missing or invalid stop_loss");
  }

  // TP1
  if (typeof signal.take_profit_1 !== "number") {
    errors.push("Missing or invalid take_profit_1");
  }

  return errors;
}

// ================================
// RISK / REWARD
// ================================

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

  if (direction === "BUY") {
    risk = entry - stop_loss;
    reward1 = take_profit_1 - entry;

    if (typeof take_profit_2 === "number") {
      reward2 = take_profit_2 - entry;
    }
  }

  if (direction === "SELL") {
    risk = stop_loss - entry;
    reward1 = entry - take_profit_1;

    if (typeof take_profit_2 === "number") {
      reward2 = entry - take_profit_2;
    }
  }

  if (risk <= 0) {
    return {
      valid: false,
      risk: risk,
      reward1: reward1,
      reward2: reward2,
      rr1: null,
      rr2: null
    };
  }

  const rr1 = reward1 / risk;

  const rr2 =
    reward2 !== null
      ? reward2 / risk
      : null;

  return {
    valid: true,
    risk: Number(risk.toFixed(5)),
    reward1: Number(reward1.toFixed(5)),
    reward2:
      reward2 !== null
        ? Number(reward2.toFixed(5))
        : null,
    rr1: Number(rr1.toFixed(2)),
    rr2:
      rr2 !== null
        ? Number(rr2.toFixed(2))
        : null
  };
}

// ================================
// WEBHOOK
// ================================

app.post("/webhook", (req, res) => {

  console.log("");
  console.log("================================");
  console.log("NEW TRADING SIGNAL");
  console.log("================================");

  console.log(req.body);

  const signal = req.body;

  // Validate
  const errors = validateSignal(signal);

  if (errors.length > 0) {

    console.log("❌ SIGNAL REJECTED");
    console.log(errors);

    return res.status(400).json({
      status: "rejected",
      mode: "TEST",
      errors: errors
    });
  }

  // Calculate Risk/Reward
  const riskReward = calculateRiskReward(signal);

  if (!riskReward.valid) {

    console.log("❌ INVALID RISK / REWARD");

    return res.status(400).json({
      status: "rejected",
      mode: "TEST",
      reason: "Invalid risk/reward structure",
      risk_reward: riskReward
    });
  }

  // Minimum score
  const minimumScore = 80;

  if (signal.score < minimumScore) {

    console.log("⚠️ SIGNAL REJECTED - LOW SCORE");

    return res.json({
      status: "rejected",
      mode: "TEST",
      reason: "Score below minimum threshold",
      minimum_score: minimumScore,
      received_score: signal.score,
      signal: signal
    });
  }

  // Minimum RR
  const minimumRR = 1.5;

  if (riskReward.rr1 < minimumRR) {

    console.log("⚠️ SIGNAL REJECTED - LOW RR");

    return res.json({
      status: "rejected",
      mode: "TEST",
      reason: "Risk/Reward below minimum threshold",
      minimum_rr: minimumRR,
      risk_reward: riskReward,
      signal: signal
    });
  }

  // ================================
  // SIGNAL ACCEPTED
  // ================================

  console.log("🟢 SIGNAL ACCEPTED");

  console.log("Symbol:", signal.symbol);
  console.log("Timeframe:", signal.timeframe);
  console.log("Signal:", signal.signal);
  console.log("Score:", signal.score);
  console.log("Entry:", signal.entry);
  console.log("SL:", signal.stop_loss);
  console.log("TP1:", signal.take_profit_1);
  console.log("TP2:", signal.take_profit_2);
  console.log("RR1:", riskReward.rr1);

  // IMPORTANT:
  // Chưa gửi lệnh sang Exness.

  res.json({
    status: "accepted",
    mode: "TEST",

    signal: {
      symbol: signal.symbol,
      timeframe: signal.timeframe,
      signal: signal.signal,
      score: signal.score,
      entry: signal.entry,
      stop_loss: signal.stop_loss,
      take_profit_1: signal.take_profit_1,
      take_profit_2: signal.take_profit_2
    },

    risk_reward: riskReward,

    execution: {
      exness: false,
      order_sent: false,
      message: "Signal accepted. Exness execution is disabled in V2."
    }
  });
});

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {
  console.log("");
  console.log("================================");
  console.log("Bao AI Trading V2");
  console.log("Server running on port " + PORT);
  console.log("Mode: TEST");
  console.log("Exness execution: DISABLED");
  console.log("================================");
});