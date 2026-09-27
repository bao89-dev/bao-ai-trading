const {
  getInstrument
} = require("../config/instruments");

// ========================================
// SIGNAL NORMALIZER
// ========================================
//
// Nhiệm vụ:
//
// Raw Signal
//     ↓
// Normalize
//     ↓
// Standard Signal Format
//
// Format chuẩn phải tương thích với:
//
// - server.js
// - Risk Engine
// - Signal Analyzer
// - Decision Engine
//
// ========================================

function normalizeSignal(rawSignal, options = {}) {

  const errors = [];

  // ========================================
  // 1. BASIC VALIDATION
  // ========================================

  if (!rawSignal || typeof rawSignal !== "object") {
    return {
      success: false,
      errors: ["Signal must be an object"]
    };
  }

  // ========================================
  // 2. SYMBOL
  // ========================================

  if (
    !rawSignal.symbol ||
    typeof rawSignal.symbol !== "string"
  ) {
    errors.push("Missing or invalid symbol");
  }

  const symbol = rawSignal.symbol
    ? rawSignal.symbol.trim().toUpperCase()
    : null;

  // ========================================
  // 3. INSTRUMENT CONFIGURATION
  // ========================================

  const instrument = symbol
    ? getInstrument(symbol)
    : null;

  if (!instrument) {
    errors.push(
      `Unsupported instrument: ${symbol || "UNKNOWN"}`
    );
  }

  // ========================================
  // 4. TIMEFRAME
  // ========================================

  const timeframe = rawSignal.timeframe
    ? String(rawSignal.timeframe).trim().toLowerCase()
    : null;

  if (!timeframe) {
    errors.push("Missing timeframe");
  }

  // ========================================
  // 5. SIGNAL / SIDE
  // ========================================

  const rawSide =
    rawSignal.signal ??
    rawSignal.side ??
    rawSignal.action;

  const side = rawSide
    ? String(rawSide).trim().toUpperCase()
    : null;

  if (!["BUY", "SELL"].includes(side)) {
    errors.push("Signal must be BUY or SELL");
  }

  // ========================================
  // 6. SCORE
  // ========================================

  let score = null;

  if (rawSignal.score !== undefined) {

    score = Number(rawSignal.score);

    if (!Number.isFinite(score)) {
      errors.push("Invalid score");
    }

  } else {

    errors.push("Missing score");
  }

  // ========================================
  // 7. PRICE FIELDS
  // ========================================

  const entry = Number(
    rawSignal.entry
  );

  const stopLoss = Number(
    rawSignal.stop_loss ??
    rawSignal.stopLoss ??
    rawSignal.sl
  );

  const takeProfit1 = Number(
    rawSignal.take_profit_1 ??
    rawSignal.takeProfit1 ??
    rawSignal.tp1
  );

  const takeProfit2 = Number(
    rawSignal.take_profit_2 ??
    rawSignal.takeProfit2 ??
    rawSignal.tp2
  );

  // ========================================
  // ENTRY VALIDATION
  // ========================================

  if (!Number.isFinite(entry)) {
    errors.push(
      "Missing or invalid entry"
    );
  }

  // ========================================
  // STOP LOSS VALIDATION
  // ========================================

  if (!Number.isFinite(stopLoss)) {
    errors.push(
      "Missing or invalid stop loss"
    );
  }

  // ========================================
  // TAKE PROFIT 1 VALIDATION
  // ========================================

  if (!Number.isFinite(takeProfit1)) {
    errors.push(
      "Missing or invalid take profit 1"
    );
  }

  // ========================================
  // 8. SOURCE
  // ========================================

  const source =
    options.source ||
    rawSignal.source ||
    "unknown";

  // ========================================
  // 9. TIMESTAMP
  // ========================================

  const timestamp =
    rawSignal.timestamp ||
    new Date().toISOString();

  // ========================================
  // 10. RETURN ERRORS
  // ========================================

  if (errors.length > 0) {

    return {
      success: false,
      errors
    };
  }

  // ========================================
  // 11. STANDARDIZED SIGNAL
  // ========================================
  //
  // QUAN TRỌNG:
  //
  // Giữ cả:
  //
  // signal / stop_loss / take_profit_1
  //
  // và:
  //
  // side / stopLoss / takeProfit1
  //
  // để các module hiện tại tương thích.
  //
  // ========================================

  const normalizedSignal = {

    // --------------------------------------
    // CORE IDENTITY
    // --------------------------------------

    symbol,

    // --------------------------------------
    // INSTRUMENT
    // --------------------------------------

    instrument: {

      symbol:
        instrument.symbol,

      name:
        instrument.name,

      assetClass:
        instrument.assetClass,

      market:
        instrument.market,

      quoteCurrency:
        instrument.quoteCurrency
    },

    // --------------------------------------
    // TIMEFRAME
    // --------------------------------------

    timeframe,

    // --------------------------------------
    // SIGNAL DIRECTION
    // --------------------------------------

    signal: side,

    // Alias cho Analyzer
    side,

    // --------------------------------------
    // SCORE
    // --------------------------------------

    score,

    // --------------------------------------
    // ENTRY
    // --------------------------------------

    entry,

    // --------------------------------------
    // STOP LOSS
    // --------------------------------------

    stop_loss: stopLoss,

    // Alias cho Analyzer
    stopLoss,

    // --------------------------------------
    // TAKE PROFIT 1
    // --------------------------------------

    take_profit_1: takeProfit1,

    // Alias cho Analyzer
    takeProfit1,

    // --------------------------------------
    // TAKE PROFIT 2
    // --------------------------------------

    take_profit_2:
      Number.isFinite(takeProfit2)
        ? takeProfit2
        : null,

    // Alias cho Analyzer
    takeProfit2:
      Number.isFinite(takeProfit2)
        ? takeProfit2
        : null,

    // --------------------------------------
    // SOURCE
    // --------------------------------------

    source,

    // --------------------------------------
    // TIMESTAMP
    // --------------------------------------

    timestamp,

    // --------------------------------------
    // MODE
    // --------------------------------------

    mode:
      instrument.trading.paperTrading
        ? "PAPER"
        : "LIVE"
  };

  // ========================================
  // 12. SUCCESS
  // ========================================

  return {

    success: true,

    signal: normalizedSignal

  };
}

// ========================================
// EXPORT
// ========================================

module.exports = {
  normalizeSignal
};