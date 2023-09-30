import { generateUniqueRandomString } from "./protocol.js";
import { deterministicScrambler } from "./privateScrambler.js";
import { Keypair } from "@solana/web3.js";
import { encryptDerive, decryptDerive } from "./e.js";
import { scramblePin } from "./scrambler.js";
import { decryptionKey } from "./TEE.js";
import bs58 from "bs58";

function encrypt(PIN: number, privateKey: any) {
  
  const userNonce = generateUniqueRandomString()
  const protocolNonce = generateUniqueRandomString()
  const userSecret = scramblePin(PIN, userNonce)
  const privateKeyPassword = deterministicScrambler(userSecret, protocolNonce)
  const keypair = privateKey

  const value = encryptDerive(privateKeyPassword, protocolNonce, keypair)

  const password = decryptDerive(privateKeyPassword, protocolNonce, value)

  const decryptedArray = decryptionKey(userSecret, protocolNonce, value)
  // console.log(decryptedArray)
  
}



const key = Keypair.generate().secretKey
console.log(key)
const address = bs58.encode(key)
console.log(address)
// Decode the base58-encoded string
const decodedBytes = bs58.decode(address);

// Create a Uint8Array from the decoded bytes
const uint8Array = new Uint8Array(decodedBytes);

console.log('Uint8Array:', uint8Array);
const PIN = 9923

encrypt(PIN, key)