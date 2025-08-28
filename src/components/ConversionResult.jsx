import React from "react";

export default function ConversionResult({ converted, exchangeInfo }) {
  if (!converted) {
    return <div className="result-placeholder">Converted amount will appear here</div>;
  }
  return (
    <div className="result">
      <h3>Result</h3>
      <p className="converted-value">{converted}</p>
      {exchangeInfo && (
        <p className="exchange-info">
          Exchange rate: {exchangeInfo.pairRate} • Fetched: {exchangeInfo.lastFetched}
        </p>
      )}
    </div>
  );
}
