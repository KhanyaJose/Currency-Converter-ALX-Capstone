import React from "react";

export default function CurrencySelector({ label, value, onChange, options = [] }) {
  return (
    <div className="currency-selector">
      <label className="small-label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </div>
  );
}
