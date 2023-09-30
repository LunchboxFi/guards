import { deterministicScrambler } from "./privateScrambler.js";
//This computation will be done in private solana program or a TEE
export function proofChecker(SecretA: string, secretB: string) {

const Ahex = Buffer.from(SecretA, 'utf-8').toString('hex');
const Bhex = Buffer.from(secretB, 'utf-8').toString('hex');
const result = parseInt(Ahex, 16) / parseInt(Bhex, 16);

 if ( result != 1 ) {
    return false
 }

 return true
   
};

function decryptPassword(hashA: any, hashB: any) {
  
  //basically saying are you sure you're who you claim to be?
  const checker = proofChecker(hashA, hashB);

  if (checker === true) {
    const key = deterministicScrambler(hashA, hashB)
    return key
  }
  
  return checker

}