const INSTRUMENTS = {
  // =========================
  // FOREX
  // =========================

  EURUSD: {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    assetClass: "FOREX",
    market: "FOREX",
    quoteCurrency: "USD",
    price: { digits: 5, tickSize: 0.00001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  GBPUSD: {
    symbol: "GBPUSD",
    name: "British Pound / US Dollar",
    assetClass: "FOREX",
    market: "FOREX",
    quoteCurrency: "USD",
    price: { digits: 5, tickSize: 0.00001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  USDJPY: {
    symbol: "USDJPY",
    name: "US Dollar / Japanese Yen",
    assetClass: "FOREX",
    market: "FOREX",
    quoteCurrency: "JPY",
    price: { digits: 3, tickSize: 0.001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  USDCHF: {
    symbol: "USDCHF",
    name: "US Dollar / Swiss Franc",
    assetClass: "FOREX",
    market: "FOREX",
    quoteCurrency: "CHF",
    price: { digits: 5, tickSize: 0.00001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  AUDUSD: {
    symbol: "AUDUSD",
    name: "Australian Dollar / US Dollar",
    assetClass: "FOREX",
    market: "FOREX",
    quoteCurrency: "USD",
    price: { digits: 5, tickSize: 0.00001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  USDCAD: {
    symbol: "USDCAD",
    name: "US Dollar / Canadian Dollar",
    assetClass: "FOREX",
    market: "FOREX",
    quoteCurrency: "CAD",
    price: { digits: 5, tickSize: 0.00001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  NZDUSD: {
    symbol: "NZDUSD",
    name: "New Zealand Dollar / US Dollar",
    assetClass: "FOREX",
    market: "FOREX",
    quoteCurrency: "USD",
    price: { digits: 5, tickSize: 0.00001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  // =========================
  // METALS
  // =========================

  XAUUSD: {
    symbol: "XAUUSD",
    name: "Gold / US Dollar",
    assetClass: "METAL",
    market: "CFD",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  XAGUSD: {
    symbol: "XAGUSD",
    name: "Silver / US Dollar",
    assetClass: "METAL",
    market: "CFD",
    quoteCurrency: "USD",
    price: { digits: 3, tickSize: 0.001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  // =========================
  // ENERGY
  // =========================

  USOIL: {
    symbol: "USOIL",
    name: "US Oil",
    assetClass: "ENERGY",
    market: "CFD",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  UKOIL: {
    symbol: "UKOIL",
    name: "UK Oil",
    assetClass: "ENERGY",
    market: "CFD",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  // =========================
  // INDICES
  // =========================

  NAS100: {
    symbol: "NAS100",
    name: "NASDAQ 100",
    assetClass: "INDEX",
    market: "CFD",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  US30: {
    symbol: "US30",
    name: "Dow Jones 30",
    assetClass: "INDEX",
    market: "CFD",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  SPX500: {
    symbol: "SPX500",
    name: "S&P 500",
    assetClass: "INDEX",
    market: "CFD",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  GER40: {
    symbol: "GER40",
    name: "Germany 40",
    assetClass: "INDEX",
    market: "CFD",
    quoteCurrency: "EUR",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  UK100: {
    symbol: "UK100",
    name: "UK 100",
    assetClass: "INDEX",
    market: "CFD",
    quoteCurrency: "GBP",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  JP225: {
    symbol: "JP225",
    name: "Japan 225",
    assetClass: "INDEX",
    market: "CFD",
    quoteCurrency: "JPY",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["EXNESS", "MT5"]
  },

  // =========================
  // CRYPTO
  // =========================

  BTCUSDT: {
    symbol: "BTCUSDT",
    name: "Bitcoin / Tether",
    assetClass: "CRYPTO",
    market: "CRYPTO",
    quoteCurrency: "USDT",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["OKX", "BINANCE", "BYBIT"]
  },

  ETHUSDT: {
    symbol: "ETHUSDT",
    name: "Ethereum / Tether",
    assetClass: "CRYPTO",
    market: "CRYPTO",
    quoteCurrency: "USDT",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["OKX", "BINANCE", "BYBIT"]
  },

  SOLUSDT: {
    symbol: "SOLUSDT",
    name: "Solana / Tether",
    assetClass: "CRYPTO",
    market: "CRYPTO",
    quoteCurrency: "USDT",
    price: { digits: 4, tickSize: 0.0001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["OKX", "BINANCE", "BYBIT"]
  },

  BNBUSDT: {
    symbol: "BNBUSDT",
    name: "BNB / Tether",
    assetClass: "CRYPTO",
    market: "CRYPTO",
    quoteCurrency: "USDT",
    price: { digits: 3, tickSize: 0.001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["OKX", "BINANCE", "BYBIT"]
  },

  XRPUSDT: {
    symbol: "XRPUSDT",
    name: "XRP / Tether",
    assetClass: "CRYPTO",
    market: "CRYPTO",
    quoteCurrency: "USDT",
    price: { digits: 5, tickSize: 0.00001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["OKX", "BINANCE", "BYBIT"]
  },

  ADAUSDT: {
    symbol: "ADAUSDT",
    name: "Cardano / Tether",
    assetClass: "CRYPTO",
    market: "CRYPTO",
    quoteCurrency: "USDT",
    price: { digits: 5, tickSize: 0.00001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["OKX", "BINANCE", "BYBIT"]
  },

  DOGEUSDT: {
    symbol: "DOGEUSDT",
    name: "Dogecoin / Tether",
    assetClass: "CRYPTO",
    market: "CRYPTO",
    quoteCurrency: "USDT",
    price: { digits: 6, tickSize: 0.000001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["OKX", "BINANCE", "BYBIT"]
  },

  AVAXUSDT: {
    symbol: "AVAXUSDT",
    name: "Avalanche / Tether",
    assetClass: "CRYPTO",
    market: "CRYPTO",
    quoteCurrency: "USDT",
    price: { digits: 4, tickSize: 0.0001 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: ["OKX", "BINANCE", "BYBIT"]
  },

  // =========================
  // STOCKS
  // =========================

  AAPL: {
    symbol: "AAPL",
    name: "Apple",
    assetClass: "STOCK",
    market: "STOCK",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: []
  },

  MSFT: {
    symbol: "MSFT",
    name: "Microsoft",
    assetClass: "STOCK",
    market: "STOCK",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: []
  },

  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA",
    assetClass: "STOCK",
    market: "STOCK",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: []
  },

  AMZN: {
    symbol: "AMZN",
    name: "Amazon",
    assetClass: "STOCK",
    market: "STOCK",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: []
  },

  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet",
    assetClass: "STOCK",
    market: "STOCK",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: []
  },

  META: {
    symbol: "META",
    name: "Meta Platforms",
    assetClass: "STOCK",
    market: "STOCK",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: []
  },

  TSLA: {
    symbol: "TSLA",
    name: "Tesla",
    assetClass: "STOCK",
    market: "STOCK",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: []
  },

  NFLX: {
    symbol: "NFLX",
    name: "Netflix",
    assetClass: "STOCK",
    market: "STOCK",
    quoteCurrency: "USD",
    price: { digits: 2, tickSize: 0.01 },
    risk: { maxRiskPercent: 2, maxPositions: 1 },
    trading: { enabled: true, paperTrading: true },
    supportedBrokers: []
  }
};


// ========================================
// INSTRUMENT HELPERS
// ========================================

function getInstrument(symbol) {
  if (!symbol || typeof symbol !== "string") {
    return null;
  }

  return INSTRUMENTS[symbol.toUpperCase()] || null;
}


function getSupportedInstruments() {
  return Object.keys(INSTRUMENTS);
}


function getInstrumentsByAssetClass(assetClass) {
  if (!assetClass || typeof assetClass !== "string") {
    return [];
  }

  const normalizedClass = assetClass.toUpperCase();

  return Object.values(INSTRUMENTS)
    .filter(instrument => instrument.assetClass === normalizedClass)
    .map(instrument => instrument.symbol);
}


function isInstrumentSupported(symbol) {
  return getInstrument(symbol) !== null;
}


module.exports = {
  INSTRUMENTS,
  getInstrument,
  getSupportedInstruments,
  getInstrumentsByAssetClass,
  isInstrumentSupported
};