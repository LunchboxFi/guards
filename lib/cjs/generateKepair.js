"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const web3_js_1 = require("@solana/web3.js");
// Generate a new Solana keypair
const keypair = web3_js_1.Keypair.generate();
// Get the secret key (private key) bytes
const secretKeyBytes = keypair.secretKey;
// Convert the bytes to a list of integers
const secretKeyIntList = Array.from(secretKeyBytes);
// Store the list in a JSON file
fs_1.default.writeFileSync('solana_keypair.json', JSON.stringify(secretKeyIntList));
console.log("Keypair generated and stored in 'solana_keypair.json'");
