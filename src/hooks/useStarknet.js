import { useState, useEffect } from 'react';
import { connect } from 'get-starknet';

export function useStarknet() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const starknet = await connect({ modalMode: "alwaysAsk" });
        await starknet?.enable();
        setWallet(starknet);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
    init();
  }, []);

  return { wallet };
}