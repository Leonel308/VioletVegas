// Header.js

import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { CryptoSelectionModal } from './CryptoSelectionModal';
import { motion } from 'framer-motion';

export const Header = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0);
  const [isCryptoSelectionModalOpen, setIsCryptoSelectionModalOpen] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 10000);

    return () => clearInterval(intervalId);
  }, [publicKey, connection]);

  const handleOpenDepositModal = () => {
    setIsCryptoSelectionModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setIsCryptoSelectionModalOpen(false);
  };

  return (
    <>
      <header className="bg-violet-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Violet Vegas
          </motion.h1>
          <div className="flex items-center space-x-4">
            {publicKey && (
              <motion.span
                className="text-white font-semibold bg-violet-700 py-2 px-4 rounded-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {balance.toFixed(4)} SOL
              </motion.span>
            )}
            <motion.button
              onClick={handleOpenDepositModal}
              className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Deposit
            </motion.button>
            <WalletMultiButton className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105">
              Select Wallet
            </WalletMultiButton>
          </div>
        </div>
      </header>
      <CryptoSelectionModal
        isOpen={isCryptoSelectionModalOpen}
        onClose={handleCloseDepositModal}
      />
    </>
  );
};
