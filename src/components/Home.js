// src/components/Home.js

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CryptoPrices } from './CryptoPrices';
import GamesList from './GamesList';
import { Header } from './Header';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

export const Home = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  const handleSelectGame = (gameName) => {
    navigate(`/${gameName.toLowerCase()}`);
  };

  return (
    <div className="home-container">
      <Header />

      <motion.main
        className="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GamesList onSelectGame={handleSelectGame} />

        <motion.section
          className="crypto-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CryptoPrices />
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Home;
