// ========================================
// BAO AI TRADING
// SIGNAL ANALYZER / AI ANALYSIS ENGINE
// V1 - RULE BASED / AI READY
// ========================================

function analyzeSignal(signal, riskReward = {}) {
  const reasons = [];
  const warnings = [];

  if (!signal || typeof signal !== "object") {
    return {
      success: false,
      errors: ["Invalid normalized signal"]
    };
  }

  // Normalized Signal fields
  const {
    symbol,
    timeframe,
    side,
    score,
    entry,
    stopLoss,
    takeProfit1,
    takeProfit2
  } = signal;

  // ========================================
  // 1. BASIC SIGNAL ANALYSIS
  // ========================================

  if (side === "BUY") {
    reasons.push("Signal direction is BUY");
  }

  if (side === "SELL") {
    reasons.push("Signal direction is SELL");
  }

  // ========================================
  // 2. SCORE ANALYSIS
  // ========================================

  let scoreLevel = "LOW";

  if (score >= 80) {
    scoreLevel = "HIGH";
    reasons.push("Signal score is strong");
  } else if (score >= 60) {
    scoreLevel = "MEDIUM";
    reasons.push("Signal score is acceptable");
  } else {
    warnings.push("Signal score is relatively weak");
  }

  // ========================================
  // 3. RISK / REWARD ANALYSIS
  // ========================================

  const rr1 = Number(riskReward.rr1 ?? 0);
  const rr2 = Number(riskReward.rr2 ?? 0);

  let riskLevel = "HIGH";
  let riskPassed = false;

  if (rr1 >= 2) {
    riskLevel = "LOW";
    riskPassed = true;
    reasons.push("Risk/Reward TP1 is strong");
  } else if (rr1 >= 1.5) {
    riskLevel = "MEDIUM";
    riskPassed = true;
    reasons.push("Risk/Reward TP1 is acceptable");
  } else {
    warnings.push("Risk/Reward TP1 is below preferred level");
  }

  // ========================================
  // 4. TP2 ANALYSIS
  // ========================================

  if (Number.isFinite(takeProfit2)) {
    if (rr2 >= 2) {
      reasons.push("TP2 provides additional reward potential");
    } else {
      warnings.push("TP2 Risk/Reward is limited");
    }
  }

  // ========================================
  // 5. DECISION ENGINE
  // ========================================

  let decision = "WAIT";
  let confidence = 0;

  if (score >= 80 && riskPassed) {
    decision = side;
    confidence = Math.min(95, score);
  } else if (score >= 60 && riskPassed) {
    decision = side;
    confidence = Math.min(75, score);
  } else {
    decision = "WAIT";
    confidence = Math.max(30, score || 0);
  }

  // ========================================
  // 6. SAFETY CHECK
  // ========================================

  if (
    !Number.isFinite(entry) ||
    !Number.isFinite(stopLoss) ||
    !Number.isFinite(takeProfit1)
  ) {
    decision = "WAIT";
    warnings.push("Required price data is incomplete");
  }

  // ========================================
  // 7. FINAL ANALYSIS
  // ========================================

  return {
    success: true,

    analysis: {
      symbol,
      timeframe,

      direction: side,

      score: {
        value: score,
        level: scoreLevel
      },

      price: {
        entry,
        stopLoss,
        takeProfit1,
        takeProfit2
      },

      risk: {
        level: riskLevel,
        rr1,
        rr2,
        passed: riskPassed
      },

      decision,

      confidence,

      reasons,

      warnings,

      mode: "RULE_BASED",

      aiReady: true
    }
  };
}


// ========================================
// EXPORT
// ========================================

module.exports = {
  analyzeSignal
};