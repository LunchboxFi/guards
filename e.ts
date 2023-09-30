import { Keypair } from "@solana/web3.js";
import crypto from 'crypto'

const keypair = Keypair.generate().secretKey
console.log(keypair)

// Generate a random AES encryption key and convert it to a hexadecimal string
const encryptionKey = crypto.randomBytes(32).toString('hex'); // 256 bits for AES-256

// Define your initialization vector (IV) as a string
const ivString = 'myinitialvector1234'; // Replace with your own IV string

// Convert the IV string to a Buffer of the correct length
const iv = Buffer.alloc(16); // 16 bytes for AES-256-CBC
iv.write(ivString, 'utf8');

// Text to be encrypted
const textToEncrypt = 'Hello, World!';

// Create an AES cipher object with the specified key and IV
const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);

// Encrypt the text
let encryptedText = cipher.update(textToEncrypt, 'utf8', 'hex');
encryptedText += cipher.final('hex');

console.log('Encrypted Text:', encryptedText);

// Create an AES decipher object with the same key and IV for decryption
const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);

// Decrypt the encrypted text
let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
decryptedText += decipher.final('utf8');

console.log('Decrypted Text:', decryptedText);