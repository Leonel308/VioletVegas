import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CryptoPrices } from './CryptoPrices';
import { GamesList } from './GamesList';
import { Header } from './Header';
import { motion } from 'framer-motion';

export const Home = () => {
  const { publicKey } = useWallet();

  const handleSelectGame = (gameName) => {
    console.log(`Selected game: ${gameName}`);
    // Implement game selection logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 to-violet-700 text-white">
      {/* Main Header */}
      <Header />

      <motion.main
        className="container mx-auto mt-8 px-6 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Games Section */}
        <GamesList onSelectGame={handleSelectGame} />

        {/* Crypto Trading Section */}
        <motion.section
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
