// CryptoSelectionModal.js

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { DepositWithdraw } from './DepositWithdraw';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const solanaCryptos = [
  { symbol: 'SOL', name: 'Solana', decimals: 9, mintAddress: 'So11111111111111111111111111111111111111112', coingeckoId: 'solana' },
  { symbol: 'USDT', name: 'Tether USD', decimals: 6, mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', coingeckoId: 'tether' },
  { symbol: 'BTC', name: 'Wrapped Bitcoin', decimals: 8, mintAddress: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E', coingeckoId: 'wrapped-bitcoin' },
  { symbol: 'ETH', name: 'Wrapped Ethereum', decimals: 8, mintAddress: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs', coingeckoId: 'ethereum' },
];

export const CryptoSelectionModal = ({ isOpen, onClose, onDeposit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCryptos, setFilteredCryptos] = useState(solanaCryptos);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [isDepositWithdrawOpen, setIsDepositWithdrawOpen] = useState(false);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [cryptoLogos, setCryptoLogos] = useState({});

  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const fetchCryptoLogos = async () => {
      const cachedLogos = localStorage.getItem('cryptoLogos');
      const cachedTimestamp = localStorage.getItem('cryptoLogosTimestamp');

      if (cachedLogos && cachedTimestamp) {
        const now = Date.now();
        if (now - parseInt(cachedTimestamp, 10) < CACHE_DURATION) {
          setCryptoLogos(JSON.parse(cachedLogos));
          return;
        }
      }

      const logos = {};
      try {
        await Promise.all(
          solanaCryptos.map(async (crypto) => {
            try {
              const response = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto.coingeckoId}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              logos[crypto.symbol] = data.image.small;
            } catch (error) {
              console.error(`Error fetching logo for ${crypto.symbol}:`, error);
              logos[crypto.symbol] = '/placeholder.svg?height=40&width=40';
            }
          })
        );
        setCryptoLogos(logos);
        localStorage.setItem('cryptoLogos', JSON.stringify(logos));
        localStorage.setItem('cryptoLogosTimestamp', Date.now().toString());
      } catch (error) {
        console.error('Error fetching crypto logos:', error);
      }
    };

    if (isOpen) {
      fetchCryptoLogos();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (publicKey) {
        setLoading(true);
        try {
          const solBalance = await connection.getBalance(publicKey);
          setBalances((prevBalances) => ({
            ...prevBalances,
            SOL: solBalance / LAMPORTS_PER_SOL,
          }));

          await Promise.all(
            solanaCryptos.map(async (crypto) => {
              if (crypto.symbol !== 'SOL') {
                try {
                  const mintPublicKey = new PublicKey(crypto.mintAddress);
                  const tokenAddress = await getAssociatedTokenAddress(mintPublicKey, publicKey);

                  const accountInfo = await connection.getAccountInfo(tokenAddress);

                  if (accountInfo) {
                    const tokenBalance = await connection.getTokenAccountBalance(tokenAddress);
                    setBalances((prevBalances) => ({
                      ...prevBalances,
                      [crypto.symbol]: tokenBalance.value.uiAmount,
                    }));
                  } else {
                    setBalances((prevBalances) => ({
                      ...prevBalances,
                      [crypto.symbol]: 0,
                    }));
                  }
                } catch (error) {
                  console.error(`Error fetching balance for ${crypto.symbol}:`, error);
                  setBalances((prevBalances) => ({
                    ...prevBalances,
                    [crypto.symbol]: 0,
                  }));
                }
              }
            })
          );
        } catch (error) {
          console.error('Error fetching balances:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchBalances();
    }
  }, [isOpen, publicKey, connection]);

  useEffect(() => {
    const filtered = solanaCryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCryptos(filtered);
  }, [searchTerm]);

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
    setIsDepositWithdrawOpen(true);
  };

  const handleDepositWithdrawClose = () => {
    setIsDepositWithdrawOpen(false);
    setSelectedCrypto(null);
  };

  const handleDepositComplete = (amount, symbol) => {
    onDeposit(amount, symbol);
    setIsDepositWithdrawOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-[32rem] max-h-[90vh] overflow-y-auto crypto-modal-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Deposit Options</h2>
          <button onClick={onClose} className="text-white text-3xl" aria-label="Close">
            &times;
          </button>
        </div>
        <input
          type="text"
          placeholder="Search cryptocurrency"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 bg-gray-700 text-white rounded text-lg"
        />
        {loading ? (
          <div className="text-white text-center">Loading balances...</div>
        ) : (
          filteredCryptos.map((crypto) => (
            <button
              key={crypto.symbol}
              onClick={() => handleCryptoSelect(crypto)}
              className="w-full flex items-center justify-between p-4 mb-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <div className="flex items-center">
                <img
                  src={cryptoLogos[crypto.symbol] || '/placeholder.svg?height=40&width=40'}
                  alt={`${crypto.name} icon`}
                  className="w-10 h-10 mr-4 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.svg?height=40&width=40';
                  }}
                />
                <div className="text-left">
                  <p className="text-white font-bold text-lg">{crypto.symbol}</p>
                  <p className="text-gray-400">
                    {balances[crypto.symbol]?.toFixed(crypto.decimals) || '0'} {crypto.symbol}
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-lg">
                ${((balances[crypto.symbol] || 0) * 1).toFixed(2)}
              </span>
            </button>
          ))
        )}
      </div>
      {selectedCrypto && (
        <DepositWithdraw
          isOpen={isDepositWithdrawOpen}
          onClose={handleDepositWithdrawClose}
          crypto={selectedCrypto}
          onDeposit={handleDepositComplete}
        />
      )}
      <style>{`
        .crypto-modal-content::-webkit-scrollbar {
          width: 10px;
        }
        .crypto-modal-content::-webkit-scrollbar-track {
          background: #2D3748;
          border-radius: 5px;
        }
        .crypto-modal-content::-webkit-scrollbar-thumb {
          background: #4A5568;
          border-radius: 5px;
        }
        .crypto-modal-content::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
};
