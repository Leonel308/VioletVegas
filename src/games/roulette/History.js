// src/games/roulette/History.js

import React from 'react';
import './History.css';

const History = ({ history }) => {
  return (
    <div className="history">
      <h2>Historial de Resultados</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            <span>Número: {entry.number}</span>
            <span className={entry.color}>{entry.color}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
