// DepositWithdraw.js

import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Buffer } from 'buffer';

// Polyfill for Buffer
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed bottom-4 right-4 p-4 rounded-md ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white`}
  >
    {message}
    <button onClick={onClose} className="ml-2 font-bold">
      ×
    </button>
  </div>
);

export const DepositWithdraw = ({ isOpen, onClose, crypto, onDeposit, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const CASINO_WALLET_ADDRESS = new PublicKey('7WvNdmN89YhbP65NRvJP8DMcc3rLpmWjPXhjftuK6QKR');

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleDeposit = async () => {
    if (!publicKey) {
      showToast('Please connect your wallet to deposit.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
      if (isNaN(lamports) || lamports <= 0) {
        showToast('Please enter a valid amount.', 'error');
        setIsLoading(false);
        return;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: CASINO_WALLET_ADDRESS,
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('The transaction failed to confirm.');
      }

      onDeposit(amount, crypto.symbol);
      showToast(`You have successfully deposited ${amount} ${crypto.symbol}`);
    } catch (error) {
      console.error('Deposit error:', error);
      if (error.message === 'User rejected the request.') {
        showToast('You canceled the transaction.', 'error');
      } else {
        showToast(error.message || 'An error occurred while processing your deposit.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!publicKey) {
      showToast('Please connect your wallet to withdraw.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate successful withdrawal
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onWithdraw(amount, crypto.symbol);
      showToast(`Your withdrawal request of ${amount} ${crypto.symbol} has been processed.`);
    } catch (error) {
      console.error('Withdrawal error:', error);
      showToast(error.message || 'An error occurred while processing your withdrawal.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-4">Deposit/Withdraw {crypto.symbol}</h2>
        <p className="text-gray-300 mb-4">
          Your Connected Wallet: {publicKey?.toBase58() || 'Not connected'}
        </p>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />
        <div className="flex justify-between">
          <button
            onClick={handleDeposit}
            disabled={isLoading || !amount}
            className="w-[48%] p-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Deposit'}
          </button>
          <button
            onClick={handleWithdraw}
            disabled={isLoading || !amount}
            className="w-[48%] p-2 bg-red-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Withdraw'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
