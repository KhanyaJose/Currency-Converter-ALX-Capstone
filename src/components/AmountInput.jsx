import React from "react";

export default function AmountInput({ amount, setAmount }) {
  return (
    <div className="amount-input">
      <label className="small-label">AMOUNT</label>
      <input
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
    </div>
  );
}
