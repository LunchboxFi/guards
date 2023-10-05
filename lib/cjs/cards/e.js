"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptDerive = exports.encryptDerive = void 0;
const web3_js_1 = require("@solana/web3.js");
const crypto_1 = __importDefault(require("crypto"));
const keypair = web3_js_1.Keypair.generate().secretKey;
// console.log(keypair)
// console.log(keypair.toString())
function encryptDerive(inputString, ivString, textToEncrypt) {
    const inputBuffer = Buffer.from(inputString, 'utf-8');
    const keyLength = 256;
    const hash = crypto_1.default.createHash('sha256');
    hash.update(inputBuffer);
    const aesKey = hash.digest().slice(0, keyLength / 8);
    const encryptionKey = aesKey.toString('hex');
    const iv = Buffer.alloc(16);
    iv.write(ivString, 'utf8');
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
    let encryptedText = cipher.update(textToEncrypt, 'utf8', 'hex');
    encryptedText += cipher.final('hex');
    return encryptedText;
}
exports.encryptDerive = encryptDerive;
function decryptDerive(inputString, ivString, encryptedText) {
    const inputBuffer = Buffer.from(inputString, 'utf-8');
    const keyLength = 256;
    const hash = crypto_1.default.createHash('sha256');
    hash.update(inputBuffer);
    const aesKey = hash.digest().slice(0, keyLength / 8);
    const encryptionKey = aesKey.toString('hex');
    const iv = Buffer.alloc(16);
    iv.write(ivString, 'utf8');
    // const iv = Buffer.from(ivString, 'utf8'); // Use the same IV for encryption and decryption
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedText += decipher.final('utf8');
    return decryptedText;
}
exports.decryptDerive = decryptDerive;
// Example usage:
const password = 'YourSecretString';
const ivString = 'myinitidknwNJDNNKNKDKNKmkDKDNMkdnnkenoru234';
const textToEncrypt = 'Hello, this is a secret message!';
// const result = encryptDerive(password, ivString, textToEncrypt);
// const decipher = decryptDerive(password, ivString, result)
// console.log('Encrypted Text:', result);
// console.log('Decrypted Text:', decipher);
//   console.log('Decrypted Text:', result.decryptedText);
