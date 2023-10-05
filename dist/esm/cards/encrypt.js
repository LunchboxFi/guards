import { generateUniqueRandomString } from "./protocol.js";
import { deterministicScrambler } from "./privateScrambler.js";
import { encryptDerive, decryptDerive } from "./e.js";
import { scramblePin } from "./scrambler.js";
export function encrypt(PIN, privateKey) {
    const userNonce = generateUniqueRandomString();
    const protocolNonce = generateUniqueRandomString();
    const userSecret = scramblePin(PIN, userNonce);
    const privateKeyPassword = deterministicScrambler(userSecret, protocolNonce);
    const keypair = privateKey;
    const value = encryptDerive(privateKeyPassword, protocolNonce, keypair);
    const password = decryptDerive(privateKeyPassword, protocolNonce, value);
    return {
        userNonce,
        protocolNonce,
        PIN,
        value
    };
}
