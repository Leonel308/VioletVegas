// src/components/UserBalanceContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import styles from '../games/roulette/RouletteGame.css';

// Asegúrate de implementar esta función o reemplázala según tus necesidades
// import { fetchSolBalance } from '../utils/solana';

const UserBalanceContext = createContext();

export const useUserBalance = () => {
  return useContext(UserBalanceContext);
};

export const UserBalanceProvider = ({ children }) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [balanceType, setBalanceType] = useState('FAKE'); // 'SOL' o 'FAKE'
  const [solBalance, setSolBalance] = useState(0);
  const [fakeBalance, setFakeBalance] = useState(1000); // Balance inicial falso

  // Fetch real SOL balance cuando el usuario se conecta
  useEffect(() => {
    const getSolBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(new PublicKey(publicKey));
          setSolBalance(balance / 1e9); // Convertir lamports a SOL
        } catch (error) {
          console.error('Error al obtener el balance de SOL:', error);
          setSolBalance(0);
        }
      } else {
        setSolBalance(0);
      }
    };

    getSolBalance();
  }, [publicKey, connection]);

  const switchBalanceType = (type) => {
    setBalanceType(type);
  };

  const deposit = (amount) => {
    if (balanceType === 'SOL') {
      setSolBalance((prev) => prev + amount);
    } else {
      setFakeBalance((prev) => prev + amount);
    }
  };

  const withdraw = (amount) => {
    if (balanceType === 'SOL') {
      setSolBalance((prev) => prev - amount);
    } else {
      setFakeBalance((prev) => prev - amount);
    }
  };

  // Computar el balance actual basado en balanceType
  const balance = balanceType === 'SOL' ? solBalance : fakeBalance;

  const value = {
    balanceType,
    solBalance,
    fakeBalance,
    balance,
    switchBalanceType,
    deposit,
    withdraw,
    setSolBalance, // Para actualizar desde fuera si es necesario
  };

  return <UserBalanceContext.Provider value={value}>{children}</UserBalanceContext.Provider>;
};
