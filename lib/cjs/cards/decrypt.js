"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = void 0;
const privateScrambler_js_1 = require("./privateScrambler.js");
const e_js_1 = require("./e.js");
const scrambler_js_1 = require("./scrambler.js");
const TEE_js_1 = require("./TEE.js");
const bs58_1 = __importDefault(require("bs58"));
function decrypt(PIN, userNonce, protocolNonce, value) {
    const userSecret = (0, scrambler_js_1.scramblePin)(PIN, userNonce);
    const privateKeyPassword = (0, privateScrambler_js_1.deterministicScrambler)(userSecret, protocolNonce);
    const password = (0, e_js_1.decryptDerive)(privateKeyPassword, protocolNonce, value);
    const decryptedbs58 = (0, TEE_js_1.decryptionKey)(userSecret, protocolNonce, value);
    const processedPrivateKey = bs58_1.default.decode(decryptedbs58);
    return processedPrivateKey;
}
exports.decrypt = decrypt;
// const key = Keypair.generate().secretKey
// const address = bs58.encode(key)
// console.log(address)
// Decode the base58-encoded string
// const decodedBytes = bs58.decode(address);
// Create a Uint8Array from the decoded bytes
// const uint8Array = new Uint8Array(decodedBytes);
// console.log('Uint8Array:', uint8Array);
// const PIN = 9923
// const userNonce = '/Nnu9l=37twAJn=7';
// const protocolNonce = 'n7ungl=L7iMj=93G';
// const value = '973fffdea19c79a1f631c545847a6be737e359895904c33290d5446b65aae97ba56c508b857d5d436a7012d35a1fba40e4b0dd50f4623f83541ad2d0026ff7ca7c5244494839064fd3bc9e793ade4586ec5f5606b1b7d5786f594065bfd418fa'
// // decrypt flow
//  const decryptt = decrypt(PIN, userNonce, protocolNonce, value);
//  console.log(decryptt)
