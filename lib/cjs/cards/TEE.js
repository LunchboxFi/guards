"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptionKey = void 0;
const privateScrambler_js_1 = require("./privateScrambler.js");
const e_js_1 = require("./e.js");
const dief_js_1 = require("./dief.js");
//This computation will be done in private solana program or a TEE
function decryptionKey(userSecret, protocolNonce, value) {
    //basically saying are you sure you're who you claim to be?
    const checker = (0, dief_js_1.verifyOwnership)(userSecret, protocolNonce);
    if (checker === true) {
        const key = (0, privateScrambler_js_1.deterministicScrambler)(userSecret, protocolNonce);
        const privateKey = (0, e_js_1.decryptDerive)(key, protocolNonce, value);
        return privateKey;
    }
    return checker;
}
exports.decryptionKey = decryptionKey;
