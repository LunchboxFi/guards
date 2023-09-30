import { Keypair } from "@solana/web3.js";
import crypto from 'crypto'

const keypair = Keypair.generate().secretKey

// console.log(keypair)
// console.log(keypair.toString())

export function encryptAndDecryptText(inputString: any, ivString: any, textToEncrypt: any) {
    // Convert the input string into a buffer
    const inputBuffer = Buffer.from(inputString, 'utf-8');
    const keyLength = 256;
    // Generate a cryptographic hash of the input string (use a strong hash function)
    const hash = crypto.createHash('sha256'); // You can use other hash functions as well
    hash.update(inputBuffer);
  
    // Derive the AES encryption key from the hash
    const aesKey = hash.digest().slice(0, keyLength / 8); // 8 bits in a byte
  
    const encryptionKey = aesKey.toString('hex'); // 256 bits for AES-256
  
    // Convert the IV string to a buffer
    const iv = Buffer.alloc(16);
    iv.write(ivString, 'utf8');
  
    // Create an AES cipher object with the specified key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  
    // Encrypt the text
    let encryptedText = cipher.update(textToEncrypt, 'utf8', 'hex');
    encryptedText += cipher.final('hex');
  
   
  
    return {
      encryptedText,
    };
  }

  export function decryptPrivateKey(encryptedText: any, iv:any, encryptionKey: any) {
    // Create an AES decipher object with the same key and IV for decryption
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  
    // Decrypt the encrypted text
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedText += decipher.final('utf8');

    return decryptedText
  }
  
  // Example usage:
  const inputString = 'YourSecretString';
  
  const ivString = 'myinitialvector1234';
  const textToEncrypt = 'Hello, this is a secret message!';
  
//   const result = encryptAndDecryptText(inputString, ivString, textToEncrypt);
  
//   console.log('Encrypted Text:', result.encryptedText);
//   console.log('Decrypted Text:', result.decryptedText);