import { generateUniqueRandomString } from "./protocol.js";
import { deterministicScrambler } from "./privateScrambler.js";
import { Keypair } from "@solana/web3.js";
import { encryptAndDecryptText } from "./e.js";
import { scramblePin } from "./scrambler.js";
import { decryptPrivateKey } from "./e.js";
import { decryptionKey } from "./TEE.js";

function encrypt(PIN: number, privateKey: any) {
  
  const userNonce = generateUniqueRandomString()
  const protocolNonce = generateUniqueRandomString()

  const userSecret = scramblePin(PIN, userNonce)
  const privateKeyPassword = deterministicScrambler(userSecret, protocolNonce)
  console.log(privateKeyPassword)
  const keypair = privateKey

  const value = encryptAndDecryptText(privateKeyPassword, protocolNonce, keypair)

  const decryptionKeyy = decryptionKey(userSecret, protocolNonce, protocolNonce, value)
  const decrypt = decryptPrivateKey(privateKey, protocolNonce, key)
}



const key = Keypair.generate().secretKey.toString()
const PIN = 9923

encrypt(PIN, key)