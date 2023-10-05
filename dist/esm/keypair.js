import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
export function convertBase58ToKeypair(publicKeyBase58, privateKeyBase58) {
    const publicKey = bs58.decode(publicKeyBase58);
    const privateKey = bs58.decode(privateKeyBase58);
    // Create a Solana keypair
    const keypair = Keypair.fromSecretKey(privateKey);
    console.log(keypair);
    return keypair;
}
// Example usage:
const publicKeyBase58 = 'FY2MFVEfkCcifK5kAab6wctb6jeT17WzdEZvZNkW816r';
const privateKeyBase58 = '';
try {
    const keypair = convertBase58ToKeypair(publicKeyBase58, privateKeyBase58);
    console.log('Keypair:', keypair);
}
catch (error) {
    console.error('Error:', error.message);
}
