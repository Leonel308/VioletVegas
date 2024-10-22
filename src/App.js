// src/App.js

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import RouletteGame from './games/roulette/RouletteGame';
import { UserBalanceProvider } from './components/UserBalanceContext'; // Importar el Proveedor de Balance
import ErrorBoundary from './components/ErrorBoundary'; // Importar el Error Boundary

// Estilos predeterminados que pueden ser sobreescritos por tu app
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  // Definir la red: 'devnet', 'testnet' o 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // Proporcionar un endpoint RPC personalizado basado en la red seleccionada
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Registrar los adaptadores de wallet necesarios
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Proveedor para manejar los balances de usuario (SOL y FAKE) */}
          <UserBalanceProvider>
            {/* ErrorBoundary para capturar y manejar errores en la UI */}
            <ErrorBoundary>
              {/* Configuración del enrutador */}
              <Router>
                {/* Si deseas que el Header esté presente en todas las rutas, descomenta la siguiente línea */}
                {/* <Header /> */}
                <Routes>
                  {/* Ruta principal: Home */}
                  <Route path="/" element={<Home />} />
                  {/* Ruta para el juego de Ruleta */}
                  <Route path="/roulette" element={<RouletteGame />} />
                  {/* Agrega rutas para otros juegos o páginas según sea necesario */}
                </Routes>
              </Router>
            </ErrorBoundary>
          </UserBalanceProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
