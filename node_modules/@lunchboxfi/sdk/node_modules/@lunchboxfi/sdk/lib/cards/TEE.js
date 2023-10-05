import { deterministicScrambler } from "./privateScrambler.js";
import { decryptDerive } from "./e.js";
import { verifyOwnership } from "./dief.js";
//This computation will be done in private solana program or a TEE
export function decryptionKey(userSecret, protocolNonce, value) {
    //basically saying are you sure you're who you claim to be?
    const checker = verifyOwnership(userSecret, protocolNonce);
    if (checker === true) {
        const key = deterministicScrambler(userSecret, protocolNonce);
        const privateKey = decryptDerive(key, protocolNonce, value);
        return privateKey;
    }
    return checker;
}
