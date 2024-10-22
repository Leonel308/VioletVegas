// src/games/roulette/BettingPanel.js

import React, { useState } from 'react';
import './BettingPanel.css';

const BettingPanel = ({ onPlaceBet, isSpinning }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [amount, setAmount] = useState('');

  const handleBet = () => {
    if (selectedColor && amount > 0) {
      onPlaceBet({ color: selectedColor, amount: parseFloat(amount) });
      setAmount('');
      setSelectedColor(null);
    } else {
      alert('Selecciona un color y una cantidad válida.');
    }
  };

  return (
    <div className="betting-panel">
      <h2>Panel de Apuestas</h2>
      <div className="colors">
        <button
          className={`color-button red ${selectedColor === 'red' ? 'selected' : ''}`}
          onClick={() => setSelectedColor('red')}
          disabled={isSpinning}
        >
          Rojo
        </button>
        <button
          className={`color-button black ${selectedColor === 'black' ? 'selected' : ''}`}
          onClick={() => setSelectedColor('black')}
          disabled={isSpinning}
        >
          Negro
        </button>
        <button
          className={`color-button green ${selectedColor === 'green' ? 'selected' : ''}`}
          onClick={() => setSelectedColor('green')}
          disabled={isSpinning}
        >
          Verde
        </button>
      </div>
      <input
        type="number"
        placeholder="Cantidad a apostar"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isSpinning}
        min="1"
      />
      <button onClick={handleBet} disabled={isSpinning}>
        Apostar
      </button>
    </div>
  );
};

export default BettingPanel;
