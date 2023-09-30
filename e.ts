import { Keypair } from "@solana/web3.js";
import crypto from 'crypto'

const keypair = Keypair.generate().secretKey

console.log(keypair)
console.log(keypair.toString())

const inputString = 'YourSecretString';


//PIN creation

const PIN = 2345





















// The length of the AES encryption key (128, 192, or 256 bits)
const keyLength = 256; // You can choose 128 or 192 as well

// Convert the input string into a buffer
const inputBuffer = Buffer.from(inputString, 'utf-8');

// Generate a cryptographic hash of the input string (use a strong hash function)
const hash = crypto.createHash('sha256'); // You can use other hash functions as well
hash.update(inputBuffer);

// Derive the AES encryption key from the hash
const aesKey = hash.digest().slice(0, keyLength / 8); // 8 bits in a byte


const encryptionKey = aesKey.toString('hex'); // 256 bits for AES-256
console.log(encryptionKey)


const ivString = 'myinitialvector1234'; 


const iv = Buffer.alloc(16);
iv.write(ivString, 'utf8');

const textToEncrypt = keypair.toString();

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