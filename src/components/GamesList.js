// src/components/GamesList.js

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/GamesList.module.css';
import RouletteGame from '../games/roulette/RouletteGame'; // Importar el componente Roulette

const games = [
  { name: 'DICE', icon: '/template/img/home/Dice.png', subtitle: 'ROLL YOUR LUCK' },
  { name: 'MINES', icon: '/template/img/home/Mines.png', subtitle: 'HIT OR MISS' },
  { name: 'ROULETTE', icon: '/template/img/home/Roulette.png', subtitle: 'SPIN THE WHEEL' },
  { name: 'PLINKO', icon: '/template/img/home/Plinko.png', subtitle: 'BOUNCE TO WIN' },
  { name: 'CRASH', icon: '/template/img/home/Crash.png', subtitle: 'REACH THE SKY' },
  { name: 'TOWER', icon: '/template/img/home/Towers.png', subtitle: 'CLIMB THE TOP' },
  { name: 'SLOTS', icon: '/template/img/home/Slots.png', subtitle: 'SPIN TO WIN', isWide: true },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

const GamesList = memo(({ onSelectGame }) => {
  const navigate = useNavigate();

  const handleGameClick = (gameName) => {
    if (gameName === 'ROULETTE') {
      navigate('/roulette');
    } else {
      onSelectGame(gameName);
    }
  };

  return (
    <section className={styles.gamesSection}>
      <div className={styles.container}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Games
        </motion.h2>
        <motion.div
          className={styles.gamesGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {games.map((game) => (
            <motion.div
              key={game.name}
              className={`${styles.gameCard} ${game.isWide ? styles.slotsCard : ''}`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGameClick(game.name)}
            >
              <img src={game.icon} alt={game.name} className={styles.gameImage} loading="lazy" />
              <div className={styles.gameOverlay}>
                <h3 className={styles.gameName}>{game.name}</h3>
                <p className={styles.gameSubtitle}>{game.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default GamesList;
