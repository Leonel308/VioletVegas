// src/utils/solana.js

import { Connection, PublicKey } from '@solana/web3.js';

export const fetchSolBalance = async (connection, publicKey) => {
  try {
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / 1e9; // Convertir lamports a SOL
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    return 0;
  }
};
