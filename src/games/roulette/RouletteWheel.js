import React, { useEffect, useState } from 'react';
import './RouletteWheel.css';

const RouletteWheel = ({ numbers, isSpinning, onStop }) => {
  const [position, setPosition] = useState(0); // Posición de la ruleta
  const [speed, setSpeed] = useState(0); // Velocidad inicial
  const [winnerNumber, setWinnerNumber] = useState(null); // Número ganador
  const [hasChosenWinner, setHasChosenWinner] = useState(false); // Control de la selección del ganador

  useEffect(() => {
    let spinInterval;
    let spinDuration = 0; // Duración del giro

    if (isSpinning) {
      // Inicializar el giro
      setSpeed(100); // Restablecer la velocidad inicial
      setWinnerNumber(null); // Limpiar el número ganador
      setHasChosenWinner(false); // Reiniciar selección de ganador

      spinInterval = setInterval(() => {
        setPosition((prev) => (prev + speed) % (50 * numbers.length)); // Actualizar la posición de la ruleta

        // Controlar la desaceleración
        if (speed > 0) {
          setSpeed((prevSpeed) => Math.max(prevSpeed - 1, 0)); // Desacelerar de manera controlada
        }

        // Controlar la duración del giro y elegir el ganador cerca del final
        spinDuration += 50;
        if (spinDuration > 3000 && !hasChosenWinner) { // Elegir el ganador después de 3 segundos
          const randomIndex = Math.floor(Math.random() * numbers.length);
          setWinnerNumber(numbers[randomIndex].value);
          setHasChosenWinner(true);
        }

        // Detener el giro cuando la velocidad es suficientemente baja y cerca del número ganador
        if (speed === 0 && hasChosenWinner) { // Detener cuando la velocidad sea 0
          clearInterval(spinInterval);
          onStop(winnerNumber); // Notificar el número ganador
        }
      }, 50);
    }

    return () => {
      if (spinInterval) {
        clearInterval(spinInterval); // Asegurarse de limpiar el intervalo
      }
    };
  }, [isSpinning, speed, numbers, onStop, winnerNumber, hasChosenWinner]);

  return (
    <div className="roulette-wheel-container">
      {/* Flecha que apunta hacia abajo */}
      <div className="roulette-indicator"></div>
      <div
        className="roulette-numbers"
        style={{ transform: `translateX(-${position}px)` }} // Mover hacia la derecha
      >
        {numbers.map((number, index) => (
          <div key={index} className={`roulette-number ${number.color}`}>
            {number.value}
          </div>
        ))}
      </div>
      {winnerNumber && <p>Número ganador: {winnerNumber}</p>} {/* Mostrar el número ganador */}
    </div>
  );
};

export default RouletteWheel;
