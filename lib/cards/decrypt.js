import { deterministicScrambler } from "./privateScrambler.js";
import { decryptDerive } from "./e.js";
import { scramblePin } from "./scrambler.js";
import { decryptionKey } from "./TEE.js";
import bs58 from "bs58";
export function decrypt(PIN, userNonce, protocolNonce, value) {
    const userSecret = scramblePin(PIN, userNonce);
    const privateKeyPassword = deterministicScrambler(userSecret, protocolNonce);
    const password = decryptDerive(privateKeyPassword, protocolNonce, value);
    const decryptedbs58 = decryptionKey(userSecret, protocolNonce, value);
    const processedPrivateKey = bs58.decode(decryptedbs58);
    return processedPrivateKey;
}
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
