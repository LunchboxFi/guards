"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBase58ToKeypair = void 0;
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
function convertBase58ToKeypair(publicKeyBase58, privateKeyBase58) {
    const publicKey = bs58_1.default.decode(publicKeyBase58);
    const privateKey = bs58_1.default.decode(privateKeyBase58);
    // Create a Solana keypair
    const keypair = web3_js_1.Keypair.fromSecretKey(privateKey);
    console.log(keypair);
    return keypair;
}
exports.convertBase58ToKeypair = convertBase58ToKeypair;
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
