import React, { useState, useEffect } from 'react';
import RouletteWheel from './RouletteWheel';
import BettingPanel from './BettingPanel';
import GameInfo from './GameInfo';
import BetHistory from './BetHistory';
import './RouletteGame.css';

const RouletteGame = () => {
  const [numbers, setNumbers] = useState([
    { value: 0, color: 'green' },
    { value: 32, color: 'red' },
    { value: 15, color: 'black' },
    { value: 19, color: 'red' },
    { value: 4, color: 'black' },
    { value: 21, color: 'red' },
    { value: 2, color: 'black' },
    { value: 25, color: 'red' },
    { value: 17, color: 'black' },
    { value: 34, color: 'red' },
    { value: 6, color: 'black' },
    { value: 27, color: 'red' },
    { value: 13, color: 'black' },
    { value: 36, color: 'red' },
    { value: 11, color: 'black' },
    { value: 30, color: 'red' },
    { value: 8, color: 'black' },
    { value: 23, color: 'red' },
    { value: 10, color: 'black' },
    { value: 5, color: 'red' },
    { value: 24, color: 'black' },
    { value: 16, color: 'red' },
    { value: 33, color: 'black' },
    { value: 1, color: 'red' },
    { value: 20, color: 'black' },
    { value: 14, color: 'red' },
    { value: 31, color: 'black' },
    { value: 9, color: 'red' },
    { value: 22, color: 'black' },
    { value: 18, color: 'red' },
    { value: 29, color: 'black' },
    { value: 7, color: 'red' },
    { value: 28, color: 'black' },
    { value: 12, color: 'red' },
    { value: 35, color: 'black' },
    { value: 3, color: 'red' },
    { value: 26, color: 'black' },
  ]);

  const [spinningNumber, setSpinningNumber] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15); // El contador de 15 segundos
  const [history, setHistory] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false); // Nuevo estado para controlar el giro
  const [bets, setBets] = useState([]);

  // Temporizador para la ruleta
  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !isSpinning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isSpinning) {
      startSpin();
    }

    return () => clearInterval(timer);
  }, [timeLeft, isSpinning]);

  // Función para iniciar el giro de la ruleta
  const startSpin = () => {
    setIsSpinning(true); // Indicar que la ruleta está girando
  };

  // Función para detener el giro y seleccionar el número ganador
  const handleStop = (winner) => {
    setSpinningNumber(winner); // Establecer el número ganador
    const winnerColor = numbers.find((n) => n.value === winner)?.color || 'unknown'; // Asegurarnos de que obtenemos el color correcto

    setHistory((prevHistory) => [
      ...prevHistory,
      { number: winner, color: winnerColor },
    ]);

    setIsSpinning(false); // Detener el giro
    setTimeLeft(15); // Reiniciar el temporizador para la próxima ronda
  };

  // Función para manejar las apuestas
  const placeBet = (amount, color) => {
    const newBet = { amount, color, player: `Player ${bets.length + 1}` };
    setBets([...bets, newBet]);
  };

  return (
    <div className="roulette-game">
      <GameInfo timeLeft={timeLeft} />
      <RouletteWheel numbers={numbers} isSpinning={isSpinning} onStop={handleStop} />
      <BettingPanel placeBet={placeBet} />
      <BetHistory history={history} />
    </div>
  );
};

export default RouletteGame;
