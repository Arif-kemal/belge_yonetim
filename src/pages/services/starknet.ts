// src/services/starknet.ts
// -----------------------------------------------------------------------------
// Starknet servis katmanı – ChainSign front-end için tek giriş noktası.
//   • connectWallet  → tarayıcı cüzdanı bağlar ve Account nesnesi üretir
//   • sendDocument   → yeni belgeyi sözleşmeye iletir
//   • signDocument   → imzalama işlemi gönderir
//   • watchEvents    → DocumentSent vb. olayları dinler (polling)
//
// NOT → Bu dosya yalnızca tip seviyesinde örnek bir kontrat/ABI içerir.
//       Kendi deploy adresini ENV ile, derlenmiş ABI’yi ise JSON ile eklemeyi
//       unut. (Vite: `import contractAbi from "@/abi/ChainSign.json";`)
// -----------------------------------------------------------------------------

import {
    Account,
    Contract,
    Provider,
    RpcProvider,
    num,
    shortString,
    hash,
  } from 'starknet';
  
  //-------------------------------- ENV & Ayarlar ------------------------------
  
  const RPC_URL =
    import.meta.env.VITE_STARKNET_RPC_URL ??
    'https://starknet-goerli.g.alchemy.com/v2/demo'; // fallback public URL
  
  const CONTRACT_ADDRESS =
    (import.meta.env.VITE_CONTRACT_ADDRESS as string) ??
    '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  
  // JSON ABI – `src/abi/ChainSign.json` dosyasını vite bundler’ına dahil et.
  import contractAbi from '@/abi/ChainSign.json';
  
  //-------------------------------- Provider & Hesap ---------------------------
  
  const provider: Provider = new Provider({
    rpc: { nodeUrl: RPC_URL },
  });
  
  let account: Account | undefined;
  
  /**
   * Tarayıcı cüzdanını (Argent X / Braavos) bağlar.
   * enable() → kullanıcı izni → Account instance oluştur.
   */
  export async function connectWallet(): Promise<string> {
    const win = window as any;
    if (!win.starknet) throw new Error('Tarayıcı Starknet cüzdanı bulunamadı');
  
    await win.starknet.enable({ showModal: true });
    const { selectedAddress, signer } = win.starknet;
  
    if (!selectedAddress || !signer)
      throw new Error('Cüzdan bağlanamadı (kullanıcı reddetti?)');
  
    account = new Account(provider, selectedAddress, signer);
    return selectedAddress;
  }
  
  //-------------------------------- Kontrat Yardımcısı -------------------------
  
  let contract: Contract | undefined;
  
  function getContract(): Contract {
    if (!contract) {
      if (!account)
        throw new Error('Önce connectWallet() ile cüzdan bağlayın.');
      contract = new Contract(contractAbi as any, CONTRACT_ADDRESS, account);
    }
    return contract;
  }
  
  //-------------------------------- İşlevler -----------------------------------
  
  export interface SendDocumentArgs {
    title: string;
    docTypeId: string;
    signers: string[]; // wallet address listesi
    ipfsHash: string;
  }
  
  export async function sendDocument({
    title,
    docTypeId,
    signers,
    ipfsHash,
  }: SendDocumentArgs) {
    const c = getContract();
  
    const encodedTitle = shortString.encodeShortString(title.slice(0, 31));
    const encodedType = shortString.encodeShortString(docTypeId.slice(0, 31));
    const encodedHash = shortString.encodeShortString(ipfsHash.slice(0, 31));
  
    const signerFelts = signers.map((s) => num.toBigInt(s));
  
    return c.invoke('send_document', [
      encodedTitle,
      encodedType,
      BigInt(signerFelts.length),
      ...signerFelts,
      encodedHash,
    ]);
  }
  
  export async function signDocument(docId: string) {
    const c = getContract();
    return c.invoke('sign_document', [num.toBigInt(docId)]);
  }
  
  //-------------------------------- Event Listener -----------------------------
  
  export interface ChainSignEvent {
    docId: string;
    creator: string;
    blockNumber: number;
  }
  
  /**
   * 15 s aralıkla DocumentSent event’ini tarar ve callback’e iletir.
   * Döndürdüğü fonksiyon çağrıldığında polling durdurulur.
   */
  export function watchEvents(cb: (e: ChainSignEvent) => void): () => void {
    let lastBlock = 0;
  
    const poll = async () => {
      try {
        const latestBlk = await provider.getBlockLatestAccepted();
        const latestNum = Number(latestBlk.block_number);
        if (latestNum === lastBlock) return;
  
        const events = await provider.getEvents({
          address: CONTRACT_ADDRESS,
          from_block: { block_number: lastBlock || latestNum },
          to_block: { block_number: latestNum },
          keys: [hash.getSelectorFromName('DocumentSent')],
        });
  
        events.forEach((ev) =>
          cb({
            docId: ev.data[0],
            creator: ev.data[1],
            blockNumber: ev.block_number,
          }),
        );
  
        lastBlock = latestNum;
      } catch (err) {
        console.error('[watchEvents]', err);
      }
    };
  
    const id = setInterval(poll, 15_000);
    return () => clearInterval(id);
  }
  
  //-------------------------------- Varsayılan ---------------------------------
  export default {
    connectWallet,
    sendDocument,
    signDocument,
    watchEvents,
  };