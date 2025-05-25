// src/pages/services/starknet.ts

import {
  Account,
  Contract,
  Provider,
  num,
  shortString,
  hash,
  type Abi,
  type InvokeFunctionResponse,
} from 'starknet';


const RPC_URL =
  import.meta.env.VITE_STARKNET_RPC_URL ??
  'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'; 

const CONTRACT_ADDRESS =
  (import.meta.env.VITE_CONTRACT_ADDRESS as string) ??
  '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';


import contractAbiJson from '../../abis/ChainSignABI.json';
const contractAbi = contractAbiJson as Abi;


interface StarknetWindow extends Window {
  starknet?: {
    enable: (options?: { showModal?: boolean }) => Promise<void>;
    selectedAddress?: string;
    signer?: string;
    isConnected?: boolean;
  };
}

interface EventData {
  data: string[];
  block_number: number;
  transaction_hash: string;
  keys: string[];
}

interface EventsResponse {
  events: EventData[];
  continuation_token?: string;
}


const provider = new Provider({ nodeUrl: RPC_URL });
let account: Account | undefined;

export async function connectWallet(): Promise<string> {
  const win = window as StarknetWindow;
  
  if (!win.starknet) {
    throw new Error('Starknet cüzdanı bulunamadı. Lütfen ArgentX veya Braavos yükleyin.');
  }

  try {
    await win.starknet.enable({ showModal: true });
    
    const selectedAddress = win.starknet.selectedAddress;
    const signer = win.starknet.signer;

    if (!selectedAddress || !signer) {
      throw new Error('Cüzdan bağlantısı başarısız. Kullanıcı tarafından reddedildi.');
    }

    if (!selectedAddress.startsWith('0x') || selectedAddress.length < 66) {
      throw new Error('Geçersiz cüzdan adresi formatı');
    }

    account = new Account(provider, selectedAddress, signer);
    return selectedAddress;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cüzdan bağlantı hatası: ${error.message}`);
    }
    throw new Error('Bilinmeyen cüzdan bağlantı hatası');
  }
}

let contract: Contract | undefined;

function getContract(): Contract {
  if (!contract) {
    if (!account) {
      throw new Error('Önce connectWallet() ile cüzdan bağlayın.');
    }
    
    contract = new Contract(contractAbi as Abi, CONTRACT_ADDRESS, account);
  }
  return contract;
}

export interface SendDocumentArgs {
  title: string;
  docTypeId: string;
  signers: string[]; 
  ipfsHash: string;
}

export async function sendDocument({
  title,
  docTypeId,
  signers,
  ipfsHash,
}: SendDocumentArgs): Promise<InvokeFunctionResponse> {
  // Input validation
  if (!title || title.trim().length === 0) {
    throw new Error('Belge başlığı boş olamaz');
  }
  if (!docTypeId || docTypeId.trim().length === 0) {
    throw new Error('Belge tipi ID boş olamaz');
  }
  if (!signers || signers.length === 0) {
    throw new Error('En az bir imzalayan belirtilmelidir');
  }
  if (!ipfsHash || ipfsHash.trim().length === 0) {
    throw new Error('IPFS hash boş olamaz');
  }

  const c = getContract();
  
  try {
    const encodedTitle = shortString.encodeShortString(title.slice(0, 31));
    const encodedType = shortString.encodeShortString(docTypeId.slice(0, 31));
    const encodedHash = shortString.encodeShortString(ipfsHash.slice(0, 31));
    
    const signerFelts: bigint[] = signers.map((signerAddr) => {
      if (!signerAddr.startsWith('0x') || signerAddr.length < 66) {
        throw new Error(`Geçersiz imzalayan adresi: ${signerAddr}`);
      }
      return num.toBigInt(signerAddr);
    });

    const calldata = [
      encodedTitle,
      encodedType,
      signerFelts.length, 
      ...signerFelts,
      encodedHash,
    ];

    return await c.invoke('send_document', calldata);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Belge gönderme hatası: ${error.message}`);
    }
    throw new Error('Bilinmeyen belge gönderme hatası');
  }
}

export async function signDocument(docId: string): Promise<InvokeFunctionResponse> {
  if (!docId || docId.trim().length === 0) {
    throw new Error('Belge ID boş olamaz');
  }

  const c = getContract();
  
  try {
    const docIdBigInt = num.toBigInt(docId);
    return await c.invoke('sign_document', [docIdBigInt]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Belge imzalama hatası: ${error.message}`);
    }
    throw new Error('Bilinmeyen belge imzalama hatası');
  }
}

export interface ChainSignEvent {
  docId: string;
  creator: string;
  blockNumber: number;
  transactionHash: string;
}


export function watchEvents(cb: (e: ChainSignEvent) => void): () => void {
  let lastBlock = 0;
  let isPolling = false;

  const poll = async (): Promise<void> => {
    if (isPolling) return; 
    isPolling = true;

    try {
      const latestBlk = await provider.getBlockLatestAccepted();
      const latestNum = Number(latestBlk.block_number);
      
      if (latestNum === lastBlock) {
        isPolling = false;
        return;
      }

      const fromBlock = lastBlock || latestNum;
      const eventsResponse = await provider.getEvents({
        address: CONTRACT_ADDRESS,
        from_block: { block_number: fromBlock },
        to_block: { block_number: latestNum },
        keys: [[hash.getSelectorFromName('DocumentSent')]], 
        chunk_size: 100, 
      });

      
      const events = (eventsResponse as EventsResponse).events || [];

      events.forEach((event: EventData) => {
        if (event.data && event.data.length >= 2) {
          cb({
            docId: event.data[0],
            creator: event.data[1],
            blockNumber: event.block_number,
            transactionHash: event.transaction_hash,
          });
        }
      });

      lastBlock = latestNum;
    } catch (error) {
      console.error('[watchEvents] Polling hatası:', error);
    } finally {
      isPolling = false;
    }
  };

  
  poll();
  
  const intervalId = setInterval(poll, 15_000);
  
  return () => {
    clearInterval(intervalId);
    isPolling = false;
  };
}


export async function getAccountAddress(): Promise<string | null> {
  return account?.address || null;
}

export async function isWalletConnected(): Promise<boolean> {
  const win = window as StarknetWindow;
  return !!(win.starknet?.isConnected && account);
}

export default {
  connectWallet,
  sendDocument,
  signDocument,
  watchEvents,
  getAccountAddress,
  isWalletConnected,
};