// src/pages/wallet/wallet.tsx
// -----------------------------------------------------------------------------
// Basit cüzdan bağlama ekranı — kullanıcıdan Starknet cüzdanını (ArgentX / Braavos)
// bağlamasını ister, ardından bağlı adresi ve ağı gösterir.
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { connectWallet } from '../services/starknet';
import './wallet.css';

export default function Wallet() {
  const [address, setAddress] = useState<string | null>(null);
  const network = import.meta.env.VITE_STARKNET_NETWORK?.toString() ?? 'testnet';
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      setError(null);
    } catch (err) {
      // eslint ve ts için en güvenlisi: instanceof Error ile kontrol
      if (err instanceof Error) {
        setError(err.message ?? 'Cüzdan bağlanamadı');
      } else {
        setError('Cüzdan bağlanamadı');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow rounded-lg p-10 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-6 text-center">Cüzdan Bağla</h1>

        {address ? (
          <>
            <p className="text-sm text-gray-500 mb-4 text-center break-all">
              <span className="font-medium text-gray-700">Bağlı hesap:</span>{' '}
              {address}
            </p>
            <p className="text-xs text-green-600 text-center">
              Ağ: <span className="font-semibold">{network}</span>
            </p>
          </>
        ) : (
          <>
            <button
              onClick={handleConnect}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              Cüzdanı Bağla
            </button>
            {error && (
              <p className="text-xs text-red-600 mt-4 text-center">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
