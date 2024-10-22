// src/games/roulette/Timer.js

import React from 'react';
import './Timer.css';

const Timer = ({ timeLeft }) => {
  return (
    <div className="timer">
      Tiempo para la próxima apuesta: {timeLeft}s
    </div>
  );
};

export default Timer;
