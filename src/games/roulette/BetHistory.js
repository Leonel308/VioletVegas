import React from 'react';
import './BetHistory.css';

const BetHistory = ({ history }) => {
  return (
    <div className="bet-history">
      <h3>Bet History</h3>
      <ul>
        {history.map((bet, index) => (
          <li key={index}>
            {bet.player} bet {bet.amount} on {bet.color}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BetHistory;
