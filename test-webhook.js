const signal = {
  symbol: "XAUUSD",
  timeframe: "5m",
  signal: "BUY",
  score: 82,
  entry: 4378.50,
  stop_loss: 4370.50,
  take_profit_1: 4390.50,
  take_profit_2: 4400.00
};

fetch("http://localhost:3000/webhook", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(signal)
})
  .then(response => response.json())
  .then(data => {
    console.log("Server response:");
    console.log(data);
  })
  .catch(error => {
    console.error("Error:", error);
  });