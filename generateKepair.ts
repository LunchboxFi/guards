import fs from 'fs'
import { Keypair } from '@solana/web3.js';


// Generate a new Solana keypair
const keypair = Keypair.generate();

// Get the secret key (private key) bytes
const secretKeyBytes = keypair.secretKey;

// Convert the bytes to a list of integers
const secretKeyIntList = Array.from(secretKeyBytes);

// Store the list in a JSON file
fs.writeFileSync('solana_keypair.json', JSON.stringify(secretKeyIntList));

console.log("Keypair generated and stored in 'solana_keypair.json'");
