import { Contract } from 'starknet';
import ChainSignABI from '../abis/ChainSignABI.json';
import { CONTRACT_ADDRESS } from '../config';

function getContract(wallet, connectAccount = false) {
  if (!wallet) throw new Error("Wallet not connected");
  const contract = new Contract(ChainSignABI, CONTRACT_ADDRESS, wallet.provider);
  if (connectAccount) {
    contract.connect(wallet.account);
  }
  return contract;
}

export async function getDocument(wallet, docId) {
  const contract = getContract(wallet);
  const result = await contract.call('get_document', [String(docId)]);
  return result;
}

export async function sendDocument(wallet, ipfsHash, documentName, documentType, signers) {
  const contract = getContract(wallet, true);
  const result = await contract.invoke('send_document', [ipfsHash, documentName, documentType, signers]);
  return result;
}

export async function signDocument(wallet, docId) {
  const contract = getContract(wallet, true);
  const result = await contract.invoke('sign_document', [String(docId)]);
  return result;
}

export async function declineDocument(wallet, docId) {
  const contract = getContract(wallet, true);
  const result = await contract.invoke('decline_document', [String(docId)]);
  return result;
}