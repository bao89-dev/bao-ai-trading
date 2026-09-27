// ========================================
// BAO AI TRADING
// DECISION ENGINE V1
// TEST / PAPER MODE
// ========================================

function makeDecision(analysisResult, signal = {}) {

  // ----------------------------------------
  // 1. Basic validation
  // ----------------------------------------

  if (!analysisResult || typeof analysisResult !== "object") {
    return {
      success: false,
      errors: ["Missing analysis result"]
    };
  }

  if (!analysisResult.success || !analysisResult.analysis) {
    return {
      success: false,
      errors: ["Invalid analysis result"]
    };
  }

  const analysis = analysisResult.analysis;

  // ----------------------------------------
  // 2. Extract analysis data
  // ----------------------------------------

  const decisionFromAnalyzer = analysis.decision || "WAIT";

  const confidence = Number(
    analysis.confidence ?? 0
  );

  const riskLevel =
    analysis.risk?.level || "HIGH";

  const riskPassed =
    analysis.risk?.passed === true;

  const rr1 = Number(
    analysis.risk?.rr1 ?? 0
  );

  const warnings =
    Array.isArray(analysis.warnings)
      ? analysis.warnings
      : [];

  // ----------------------------------------
  // 3. Decision rules
  // ----------------------------------------

  let decision = "WAIT";
  let reasonCodes = [];

  // Invalid / unsafe analysis
  if (!riskPassed) {

    decision = "REJECT";

    reasonCodes.push(
      "RISK_CHECK_FAILED"
    );

  }

  // High risk
  else if (riskLevel === "HIGH") {

    decision = "WAIT";

    reasonCodes.push(
      "HIGH_RISK"
    );

  }

  // Analyzer says BUY / SELL
  else if (
    decisionFromAnalyzer === "BUY" ||
    decisionFromAnalyzer === "SELL"
  ) {

    if (confidence >= 80 && rr1 >= 1.5) {

      decision = decisionFromAnalyzer;

      reasonCodes.push(
        "STRONG_SIGNAL"
      );

      reasonCodes.push(
        "CONFIDENCE_OK"
      );

      reasonCodes.push(
        "RR_OK"
      );

    }

    else if (
      confidence >= 60 &&
      rr1 >= 1.5
    ) {

      decision = "WAIT";

      reasonCodes.push(
        "MODERATE_CONFIDENCE"
      );

    }

    else {

      decision = "WAIT";

      reasonCodes.push(
        "INSUFFICIENT_CONFIRMATION"
      );
    }

  }

  // Analyzer says WAIT
  else {

    decision = "WAIT";

    reasonCodes.push(
      "ANALYZER_WAIT"
    );
  }

  // ----------------------------------------
  // 4. Warning override
  // ----------------------------------------

  if (warnings.length > 0) {

    if (decision === "BUY" ||
        decision === "SELL") {

      decision = "WAIT";

      reasonCodes.push(
        "WARNINGS_PRESENT"
      );
    }
  }

  // ----------------------------------------
  // 5. Final confidence
  // ----------------------------------------

  let finalConfidence =
    Math.max(
      0,
      Math.min(100, confidence)
    );

  if (decision === "REJECT") {

    finalConfidence = 0;

  }

  // ----------------------------------------
  // 6. Return decision
  // ----------------------------------------

  return {

    success: true,

    decision: {

      symbol:
        signal.symbol ||
        analysis.symbol ||
        null,

      timeframe:
        signal.timeframe ||
        analysis.timeframe ||
        null,

      action: decision,

      confidence:
        finalConfidence,

      riskLevel,

      riskPassed,

      rr1,

      reasonCodes,

      warnings,

      mode: "PAPER",

      executionAllowed: false
    }
  };
}


// ========================================
// EXPORT
// ========================================

module.exports = {
  makeDecision
};