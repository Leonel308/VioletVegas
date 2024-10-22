import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnect = () => {
  const { publicKey } = useWallet();

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <WalletMultiButton />
      {publicKey && (
        <p className="text-sm text-gray-600">
          Connected: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </p>
      )}
    </div>
  );
};
