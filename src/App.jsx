import React, { useEffect, useState } from "react";
import CurrencySelector from "./components/CurrencySelector";
import AmountInput from "./components/AmountInput";
import ConversionResult from "./components/ConversionResult";

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;
const API_BASE = `https://v6.exchangerate-api.com/v6/${API_KEY}`; // ExchangeRate-API v6 endpoint

export default function App() {
  const [rates, setRates] = useState(null); // store rates object for chosen base
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("ZAR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState("");
  const [exchangeInfo, setExchangeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch a default set of rates (base USD) and list of supported codes
  useEffect(() => {
    async function fetchRates() {
      setLoading(true);
      setError("");
      try {
        // fetch latest with USD base to get list of supported currencies
        const res = await fetch(`${API_BASE}/latest/USD`);
        const data = await res.json();
        if (data.result === "success") {
          setRates(data.conversion_rates);
          setCurrencies(Object.keys(data.conversion_rates));
        } else {
          throw new Error(data["error-type"] || "API error");
        }
      } catch (err) {
        setError("Failed to load exchange rates. Check API key and network.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  // Convert function: use fetched rates to compute conversion
  function convert() {
    setError("");
    setConverted("");
    if (!amount || isNaN(Number(amount))) {
      setError("Enter a valid number to convert.");
      return;
    }
    if (!rates) {
      setError("Rates not loaded yet. Try again in a moment.");
      return;
    }

    // Use conversion via USD base: value_in_USD = amount / rate_of_from; result = value_in_USD * rate_of_to
    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];

    if (!rateFrom || !rateTo) {
      setError("Selected currency not supported.");
      return;
    }

    const amountNum = Number(amount);
    const inUSD = amountNum / rateFrom;
    const result = inUSD * rateTo;
    setConverted(result.toFixed(4));
    setExchangeInfo({
      pairRate: (rateTo / rateFrom).toFixed(6),
      lastFetched: new Date().toLocaleString()
    });
  }

  function clearAll() {
    setAmount("");
    setConverted("");
    setExchangeInfo(null);
    setError("");
    // optionally reset currencies to defaults:
    // setFromCurrency("ZAR");
    // setToCurrency("USD");
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="hamburger" aria-label="menu">☰</button>
        <h1>Currency Converter</h1>
        <button className="gear" aria-label="settings">⚙</button>
      </header>

      <main className="container">
        <section className="converter-card">
          <div className="selectors-row">
            <CurrencySelector
              label="FROM"
              value={fromCurrency}
              onChange={setFromCurrency}
              options={currencies}
            />
            <div className="swap-arrows">⇄</div>
            <CurrencySelector
              label="TO"
              value={toCurrency}
              onChange={setToCurrency}
              options={currencies}
            />
          </div>

          <AmountInput amount={amount} setAmount={setAmount} />

          <div className="actions-row">
            <button className="convert-btn" onClick={convert} disabled={loading}>
              CONVERT
            </button>

            <button className="clear-btn" onClick={clearAll}>
              CLEAR
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <ConversionResult converted={converted} exchangeInfo={exchangeInfo} />
        </section>
      </main>

      <footer className="app-footer">
        <p>Simple currency converter • Demo</p>
      </footer>
    </div>
  );
}
