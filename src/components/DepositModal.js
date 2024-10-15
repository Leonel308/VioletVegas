// DepositModal.js

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const CASINO_WALLET = new PublicKey('7WvNdmN89YhbP65NRvJP8DMcc3rLpmWjPXhjftuK6QKR');

export const DepositModal = ({ isOpen, onClose, onDeposit }) => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    };

    if (isOpen) {
      fetchBalance();
      setError('');
      setAmount('');
    }
  }, [publicKey, connection, isOpen]);

  const handleDeposit = async () => {
    if (!publicKey) return;

    const lamports = Math.floor(LAMPORTS_PER_SOL * parseFloat(amount));

    if (isNaN(lamports) || lamports <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      if (lamports > balance * LAMPORTS_PER_SOL) {
        throw new Error('Insufficient funds');
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: CASINO_WALLET,
          lamports: lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      onDeposit(parseFloat(amount));
      onClose();
      setAmount('');
      setError('');
      alert(`Successfully deposited ${amount} SOL`);
    } catch (error) {
      console.error('Error during deposit:', error);
      if (error.message === 'Insufficient funds') {
        setError('Insufficient balance. Please check your balance and try again.');
      } else if (error.message === 'Transaction failed') {
        setError('The transaction failed. Please try again.');
      } else {
        setError('Error making the deposit. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Deposit SOL</h2>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-300 transition-colors">
            &times;
          </button>
        </div>
        <div className="mb-4">
          <p className="text-white mb-2">Your Connected Wallet</p>
          <p className="text-sm text-gray-400 break-all bg-gray-700 p-3 rounded-lg">
            {publicKey ? publicKey.toBase58() : 'No wallet connected'}
          </p>
        </div>
        <div className="mb-6">
          <p className="text-white mb-2">Enter Deposit Amount</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-400 mt-2">Available: {balance.toFixed(4)} SOL</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleDeposit}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Deposit
        </button>
      </div>
    </div>
  );
};
