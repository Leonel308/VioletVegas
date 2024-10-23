// CryptoPrices.js

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const API_URL =
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin&vs_currencies=usd&include_24hr_change=true';

export const CryptoPrices = () => {
    const [cryptos, setCryptos] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCryptoPrices = async () => {
        setLoading(true);
        setError(null);

        const cachedData = localStorage.getItem('cryptoPrices');
        const cachedTimestamp = localStorage.getItem('cryptoPricesTimestamp');

        if (cachedData && cachedTimestamp) {
            const now = Date.now();
            if (now - parseInt(cachedTimestamp, 10) < CACHE_DURATION) {
                setCryptos(JSON.parse(cachedData));
                setLastUpdate(new Date(parseInt(cachedTimestamp, 10)));
                setLoading(false);
                return;
            }
        }

        try {
            const response = await axios.get(API_URL);
            if (response.status !== 200) {
                throw new Error(`API responded with status ${response.status}`);
            }
            const data = response.data;
            const formattedData = [
                {
                    name: 'BTC',
                    price: data.bitcoin.usd,
                    change: data.bitcoin.usd_24h_change.toFixed(2),
                },
                // {
                //   name: 'ETH',
                //   price: data.ethereum.usd,
                //   change: data.ethereum.usd_24h_change.toFixed(2),
                // },
                {
                    name: 'SOL',
                    price: data.solana.usd,
                    change: data.solana.usd_24h_change.toFixed(2),
                },
                {
                    name: 'DOGE',
                    price: data.dogecoin.usd,
                    change: data.dogecoin.usd_24h_change.toFixed(2),
                },
            ];
            setCryptos(formattedData);
            setLastUpdate(new Date());
            localStorage.setItem('cryptoPrices', JSON.stringify(formattedData));
            localStorage.setItem(
                'cryptoPricesTimestamp',
                Date.now().toString()
            );
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
            setError('Failed to fetch crypto prices. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptoPrices();
        const interval = setInterval(fetchCryptoPrices, CACHE_DURATION);
        return () => clearInterval(interval);
    }, []);

    const cryptoElements = useMemo(
        () =>
            cryptos.map((crypto, index) => (
                <motion.div
                    key={crypto.name}
                    className='bg-violet-800 p-6 rounded-xl'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                    <h3 className='font-bold text-white text-lg mb-2'>
                        {crypto.name}
                    </h3>
                    <p className='text-2xl text-white mb-2'>
                        ${crypto.price.toFixed(2)}
                    </p>
                    <p
                        className={`font-semibold ${
                            parseFloat(crypto.change) >= 0
                                ? 'text-green-500'
                                : 'text-red-500'
                        }`}
                    >
                        {parseFloat(crypto.change) >= 0 ? '+' : ''}
                        {crypto.change}%
                    </p>
                </motion.div>
            )),
        [cryptos]
    );

    if (loading) {
        return (
            <section className='mb-12'>
                <h2 className='text-2xl font-bold mb-6 text-white'>
                    Crypto Trading
                </h2>
                <div className='text-white'>Loading crypto prices...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className='mb-12'>
                <h2 className='text-2xl font-bold mb-6 text-white'>
                    Crypto Trading
                </h2>
                <div className='text-red-500'>{error}</div>
            </section>
        );
    }

    return (
        <section className='mb-12'>
            <motion.h2
                className='text-2xl font-bold mb-6 text-white'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Crypto Trading
            </motion.h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                {cryptoElements}
            </div>
            {lastUpdate && (
                <p className='text-sm text-violet-300 mt-4'>
                    Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
            )}
        </section>
    );
};
