import { generateUniqueRandomString } from "./protocol.js";
import { deterministicScrambler } from "./privateScrambler.js";
import { Keypair } from "@solana/web3.js";
import { encryptDerive, decryptDerive } from "./e.js";
import { scramblePin } from "./scrambler.js";
import { decryptionKey } from "./TEE.js";
import bs58 from "bs58";

export function encrypt(PIN: number, privateKey: any) {
  
  const userNonce = generateUniqueRandomString()
  const protocolNonce = generateUniqueRandomString()
  const userSecret = scramblePin(PIN, userNonce)
  const privateKeyPassword = deterministicScrambler(userSecret, protocolNonce)
  const keypair = privateKey

  const value = encryptDerive(privateKeyPassword, protocolNonce, keypair)

  const password = decryptDerive(privateKeyPassword, protocolNonce, value)

  
  return {
    userNonce,
    protocolNonce,
    PIN,
    value
  }
  
}