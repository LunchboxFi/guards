import { generateUniqueRandomString } from "./protocol.js";
import { deterministicScrambler } from "./privateScrambler.js";
import { Keypair } from "@solana/web3.js";
import { encryptAndDecryptText } from "./e.js";
import { scramblePin } from "./scrambler.js";

function encrypt(PIN: number, privateKey: any) {
  
  const userNonce = generateUniqueRandomString()
  const protocolNonce = generateUniqueRandomString()

  const userSecret = scramblePin(PIN, userNonce)
  const privateKeyPassword = deterministicScrambler(userSecret, protocolNonce)

  const keypair = privateKey

  const value = encryptAndDecryptText(privateKeyPassword, protocolNonce, keypair)
  console.log(value)
}

const key = Keypair.generate().secretKey.toString()
const PIN = 9923

encrypt(PIN, key)