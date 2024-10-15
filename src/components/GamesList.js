import React, { memo } from 'react';
import { motion } from 'framer-motion';

const GAMES = [
  { name: 'DICE', icon: '/template/img/home/Dice.png' },
  { name: 'MINES', icon: '/template/img/home/Mines.png' },
  { name: 'ROULETTE', icon: '/template/img/home/Roulette.png' },
  { name: 'PLINKO', icon: '/template/img/home/Plinko.png' },
  { name: 'CRASH', icon: '/template/img/home/Crash.png' },
  { name: 'TOWER', icon: '/template/img/home/Towers.png' },
];

const SLOTS = { name: 'SLOTS', icon: '/template/img/home/Slots.png' };

export const GamesList = memo(({ onSelectGame }) => {
  const css = `
    .games-section {
      margin-bottom: 3rem;
    }
    .games-title {
      font-size: 1.875rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      color: white;
    }
    .games-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* Tres columnas por defecto */
      gap: 1rem;
      margin-bottom: 1rem;
    }
    @media (min-width: 768px) {
      .games-grid {
        grid-template-columns: repeat(4, 1fr); /* Cuatro columnas en pantallas grandes */
      }
    }
    @media (min-width: 1024px) {
      .games-grid {
        grid-template-columns: repeat(4, 1fr); /* Cuatro columnas */
      }
    }
    .game-card {
      background-color: #5b21b6;
      border-radius: 0.75rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      aspect-ratio: 16 / 9; /* Mantiene una proporción 16:9 */
    }
    .game-card:hover {
      background-color: #6d28d9;
      transform: scale(1.05);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .game-card-content {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .game-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .game-card-text {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.5); /* Fondo oscuro para el texto */
      text-align: center;
    }
    .game-card-text span {
      font-size: 1.125rem;
      font-weight: 500;
      color: white;
    }

    /* Estilo especial para Slots */
    .slots-card {
      grid-column: span 2; /* Ocupar dos columnas */
      aspect-ratio: 32 / 9; /* Mantiene la proporción correcta */
    }
  `;

  return (
    <section className="games-section">
      <style>{css}</style>
      <motion.h2
        className="games-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Games
      </motion.h2>
      <div className="games-grid">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.name}
            className="game-card"
            onClick={() => onSelectGame(game.name)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <div className="game-card-content">
              <div className="game-card-image">
                <img src={game.icon} alt={game.name} />
              </div>
              <div className="game-card-text">
                <span>{game.name}</span>
              </div>
            </div>
          </motion.div>
        ))}
        {/* Tarjeta de Slots ajustada */}
        <motion.div
          className="game-card slots-card"
          onClick={() => onSelectGame(SLOTS.name)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="game-card-content">
            <div className="game-card-image">
              <img src={SLOTS.icon} alt={SLOTS.name} />
            </div>
            <div className="game-card-text">
              <span>{SLOTS.name}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
