import React, { useState } from 'react';
import './BettingPanel.css';

const BettingPanel = ({ placeBet }) => {
  const [amount, setAmount] = useState(0.01);
  const [color, setColor] = useState('red');

  const handleBet = () => {
    if (amount > 0) {
      placeBet(amount, color);
    }
  };

  return (
    <div className="betting-panel">
      <div className="betting-inputs">
        <label>Bet Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          step="0.01"
        />
        <div className="betting-buttons">
          <button onClick={() => setAmount(amount + 0.01)}>+0.01</button>
          <button onClick={() => setAmount(amount + 0.1)}>+0.10</button>
          <button onClick={() => setAmount(amount + 1)}>+1.00</button>
          <button onClick={() => setAmount(amount + 10)}>+10.00</button>
        </div>
        <div className="color-select">
          <label>
            <input
              type="radio"
              value="red"
              checked={color === 'red'}
              onChange={(e) => setColor(e.target.value)}
            />
            Red
          </label>
          <label>
            <input
              type="radio"
              value="black"
              checked={color === 'black'}
              onChange={(e) => setColor(e.target.value)}
            />
            Black
          </label>
          <label>
            <input
              type="radio"
              value="green"
              checked={color === 'green'}
              onChange={(e) => setColor(e.target.value)}
            />
            Green
          </label>
        </div>
        <button onClick={handleBet} className="place-bet-button">Place Bet</button>
      </div>
    </div>
  );
};

export default BettingPanel;
