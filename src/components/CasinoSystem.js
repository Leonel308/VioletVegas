// CasinoSystem.js

import React, { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Buffer } from 'buffer';

window.Buffer = window.Buffer || Buffer;

const CASINO_WALLET = new PublicKey('7WvNdmN89YhbP65NRvJP8DMcc3rLpmWjPXhjftuK6QKR');

export const CasinoSystem = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [userBalance, setUserBalance] = useState(0);
  const [casinoBalance, setCasinoBalance] = useState(0);
  const [gameWallet, setGameWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  const createGameWallet = useCallback(async () => {
    if (publicKey) {
      const gameWalletSeed = `betardio-${publicKey.toBase58()}`;
      try {
        const derivedPublicKey = await PublicKey.createWithSeed(
          publicKey,
          gameWalletSeed,
          SystemProgram.programId
        );
        setGameWallet(derivedPublicKey);
        updateBalance(derivedPublicKey);
      } catch (error) {
        console.error('Error creating the game wallet:', error);
        setError('Error creating the game wallet. Please try again later.');
      }
    }
  }, [publicKey]);

  const updateUserBalance = useCallback(async () => {
    if (publicKey) {
      try {
        const balance = await connection.getBalance(publicKey);
        setUserBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching user balance:', error);
        setError('Unable to fetch your balance. Please try again later.');
      }
    }
  }, [connection, publicKey]);

  const updateCasinoBalance = useCallback(async () => {
    try {
      const balance = await connection.getBalance(CASINO_WALLET);
      setCasinoBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching casino balance:', error);
      setError('Unable to fetch casino balance. Please try again later.');
    }
  }, [connection]);

  const updateBalance = useCallback(async (address) => {
    try {
      const balance = await connection.getBalance(address);
      setUserBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Unable to fetch balance. Please try again later.');
    }
  }, [connection]);

  useEffect(() => {
    if (publicKey) {
      createGameWallet();
      updateUserBalance();
    }
    updateCasinoBalance();
  }, [publicKey, createGameWallet, updateUserBalance, updateCasinoBalance]);

  const handleDeposit = async () => {
    if (!publicKey || !gameWallet) {
      setError('Please connect your wallet before making a deposit.');
      return;
    }

    setError(null);

    try {
      const lamports = LAMPORTS_PER_SOL * parseFloat(amount);

      if (isNaN(lamports) || lamports <= 0) {
        setError('Please enter a valid amount to deposit.');
        return;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: CASINO_WALLET,
          lamports: lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');

      alert('Deposit successful on betardio.sol!');
      updateUserBalance();
      updateCasinoBalance();
      setAmount('');
    } catch (error) {
      console.error('Error during deposit:', error);
      if (error.message && error.message.includes('insufficient funds')) {
        setError('Insufficient funds to make the deposit.');
      } else if (error.message && error.message.includes('User rejected')) {
        setError('Transaction rejected by the user.');
      } else if (error.message && error.message.includes('Network error')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Error making the deposit. Please try again later.');
      }
    }
  };

  const handlePlay = async () => {
    if (!publicKey || !gameWallet) return;

    const lamports = LAMPORTS_PER_SOL * parseFloat(amount);

    // Simple game simulation
    const userWins = Math.random() < 0.5;

    if (userWins) {
      // User wins, transfer from casino wallet to user
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: CASINO_WALLET,
          toPubkey: publicKey,
          lamports: lamports * 2, // Double the bet as prize
        })
      );

      try {
        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, 'processed');
        alert('You won!');
      } catch (error) {
        console.error('Error processing winnings:', error);
        alert('Error processing winnings.');
        return;
      }
    } else {
      // User loses, no transaction needed
      alert('You lost. Better luck next time.');
    }

    updateUserBalance();
    updateCasinoBalance();
    setAmount('');
  };

  if (!publicKey) {
    return <p className="text-center mt-4">Connect your wallet to play on betardio.sol</p>;
  }

  return (
    <div className="mt-8 p-4 bg-indigo-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">Custom Casino</h2>
      <div className="bg-white p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Your Wallet on betardio.sol</h3>
        <p className="mb-2">Address: {gameWallet ? gameWallet.toBase58() : 'Loading...'}</p>
        <p className="mb-2">Your Balance: {userBalance} SOL</p>
      </div>
      <div className="bg-white p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">Casino System</h3>
        <p className="mb-2">Casino Balance: {casinoBalance} SOL</p>
      </div>
      <div className="flex flex-col space-y-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to deposit/bet"
          className="p-2 border rounded"
        />
        <button
          onClick={handleDeposit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Deposit
        </button>
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Play
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};
