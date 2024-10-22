import React, { useState, useEffect, useRef } from 'react';
import './Roulette.css';
import BettingPanel from './BettingPanel';
import History from './History';
import Timer from './Timer';

// Mapeo de números a colores
const colorMapping = {
  0: 'green',
  32: 'red',
  15: 'black',
  19: 'red',
  4: 'black',
  21: 'red',
  2: 'black',
  25: 'red',
  17: 'black',
  34: 'red',
  6: 'black',
  27: 'red',
  13: 'black',
  36: 'red',
  11: 'black',
  30: 'red',
  8: 'black',
  23: 'red',
  10: 'black',
  5: 'red',
  24: 'black',
  16: 'red',
  33: 'black',
  1: 'red',
  20: 'black',
  14: 'red',
  31: 'black',
  9: 'red',
  22: 'black',
  18: 'red',
  29: 'black',
  7: 'red',
  28: 'black',
  12: 'red',
  35: 'black',
  3: 'red',
  26: 'black',
};

// Secuencia de números según ruleta europea
const numberSequence = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34,
  6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18,
  29, 7, 28, 12, 35, 3, 26,
];

const RouletteGame = () => {
  const [spinResult, setSpinResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [bets, setBets] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [balance, setBalance] = useState(1000); // Saldo inicial del usuario
  const rouletteRef = useRef(null);
  const containerRef = useRef(null);
  const [initialShift, setInitialShift] = useState(0);

  const numberWidth = 80; // Ancho de cada número en píxeles
  const randomSpins = 20; // Número de vueltas completas
  const numberOfRepeats = randomSpins + 4; // Asegura que haya suficientes números
  const totalNumbers = numberSequence.length;

  useEffect(() => {
    if (rouletteRef.current && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const shift = -(containerWidth / 2) + numberWidth / 2;
      rouletteRef.current.style.transform = `translateX(${shift}px)`;
      setInitialShift(shift);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (!isSpinning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            spinRoulette();
            return 15;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSpinning]);

  const spinRoulette = () => {
    setIsSpinning(true);
    const resultIndex = Math.floor(Math.random() * totalNumbers); // Índice del número ganador

    // Calcular el desplazamiento necesario
    const shiftAmount = (randomSpins * totalNumbers + resultIndex) * numberWidth;
    const finalTransform = initialShift - shiftAmount;

    // Aplicar la animación de desplazamiento hacia la izquierda
    rouletteRef.current.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
    rouletteRef.current.style.transform = `translateX(${finalTransform}px)`;

    // Manejar el final de la animación
    rouletteRef.current.addEventListener('transitionend', handleSpinEnd, { once: true });
  };

  const handleSpinEnd = () => {
    // Obtener el desplazamiento final
    const style = window.getComputedStyle(rouletteRef.current);
    const transform = style.transform;

    // Verificar si la transformación es una matriz
    let matrixValues = [];
    if (transform && transform !== 'none') {
      // La cadena de transformación tiene el formato "matrix(a, b, c, d, tx, ty)" o "matrix3d(...)"
      const matrixRegex = /matrix.*\((.+)\)/;
      const match = matrixRegex.exec(transform);
      if (match) {
        matrixValues = match[1].split(', ').map(parseFloat);
      }
    }

    // Obtener el desplazamiento en X
    let finalShift = 0;
    if (matrixValues.length) {
      // En una matriz 2D, el desplazamiento en X es el valor en la posición [4]
      // En una matriz 3D, el desplazamiento en X es el valor en la posición [12]
      if (matrixValues.length === 6) {
        finalShift = matrixValues[4];
      } else if (matrixValues.length === 16) {
        finalShift = matrixValues[12];
      }
    }

    // Calcular el desplazamiento total
    const totalShift = finalShift - initialShift;

    // Calcular el número de unidades desplazadas
    const unitsShifted = totalShift / numberWidth;

    // Redondear al entero más cercano
    const correctedUnitsShifted = Math.round(unitsShifted);

    // Calcular el índice del número ganador
    const resultIndex = correctedUnitsShifted % totalNumbers;
    const adjustedIndex = (resultIndex + totalNumbers) % totalNumbers; // Asegurar índice positivo

    // Obtener el número y color ganador
    const resultNumber = numberSequence[adjustedIndex];
    const color = colorMapping[resultNumber] || 'black';

    console.log('Initial Shift:', initialShift);
    console.log('Final Shift:', finalShift);
    console.log('Total Shift:', totalShift);
    console.log('Units Shifted:', unitsShifted);
    console.log('Corrected Units Shifted:', correctedUnitsShifted);
    console.log('Result Index:', resultIndex);
    console.log('Adjusted Index:', adjustedIndex);
    console.log('Result Number:', resultNumber);

    setSpinResult({ number: resultNumber, color });
    setHistory((prevHistory) => [{ number: resultNumber, color }, ...prevHistory]);

    // Procesar las apuestas
    let totalWin = 0;
    bets.forEach((bet) => {
      if (bet.color === color) {
        const winAmount = bet.amount * 2;
        totalWin += winAmount;
        console.log(`¡Ganaste! Color acertado: ${color}. Ganancia: $${winAmount}`);
      } else {
        console.log(`Perdiste. Color apostado: ${bet.color}, Resultado: ${color}. Pérdida: $${bet.amount}`);
      }
    });

    // Actualizar el saldo del usuario
    setBalance((prevBalance) => prevBalance + totalWin);

    // Limpiar las apuestas después del giro
    setBets([]);
    setIsSpinning(false);
    setTimeLeft(15);

    // Reiniciar la posición de la ruleta para el próximo giro
    rouletteRef.current.style.transition = 'none';
    rouletteRef.current.style.transform = `translateX(${initialShift}px)`;
  };

  const placeBet = (bet) => {
    if (!isSpinning) {
      if (bet.amount > balance) {
        alert('No tienes suficiente saldo para esta apuesta.');
        return;
      }
      setBets([...bets, bet]);
      // Deducir el monto de la apuesta inmediatamente
      setBalance((prevBalance) => prevBalance - bet.amount);
      console.log(`Apuesta colocada: ${bet.color} - $${bet.amount}`);
    }
  };

  return (
    <div className="roulette-game">
      <h1>Ruleta Horizontal</h1>
      <div className="balance">Saldo: ${balance.toFixed(2)}</div>
      <Timer timeLeft={timeLeft} />
      <div className="roulette-container" ref={containerRef}>
        <div className="roulette" ref={rouletteRef}>
          {Array.from({ length: numberOfRepeats }).map((_, repeatIndex) =>
            numberSequence.map((number, index) => {
              const color = colorMapping[number] || 'black';
              return (
                <div className={`number ${color}`} key={`repeat-${repeatIndex}-${index}`}>
                  {number}
                </div>
              );
            })
          )}
        </div>
        <div className="indicator">▼</div>
      </div>
      <BettingPanel onPlaceBet={placeBet} isSpinning={isSpinning} />
      <History history={history} />
    </div>
  );
};

export default RouletteGame;
