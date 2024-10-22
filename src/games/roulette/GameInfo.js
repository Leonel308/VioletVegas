import React from 'react';
import './GameInfo.css';

const GameInfo = ({ timeLeft, roundHash, roundSecret }) => {
  return (
    <div className="game-info">
      <div className="round-info">
        <p>Round hash: {roundHash || '-'}</p>
        <p>Round secret: {roundSecret || '-'}</p>
      </div>
      <div className="waiting-info">
        <p>Waiting for players...</p>
        <p>Time left: {timeLeft} seconds</p>
      </div>
    </div>
  );
};

export default GameInfo;
