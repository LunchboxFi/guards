import { deterministicScrambler } from "./privateScrambler.js";
import { decryptPrivateKey } from "./e.js";
import { verifyOwnership } from "./dief.js";
//This computation will be done in private solana program or a TEE

export function decryptionKey(hashA: any, hashB: any, iv:any, privateKey: any) {
  
  //basically saying are you sure you're who you claim to be?
  const checker = verifyOwnership(hashA, hashB);

  if (checker === true) {
    const key = deterministicScrambler(hashA, hashB)
    const password = decryptPrivateKey(privateKey, iv, key)
  }
  
  return checker

}