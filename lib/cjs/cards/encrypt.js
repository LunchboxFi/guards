"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
const protocol_js_1 = require("./protocol.js");
const privateScrambler_js_1 = require("./privateScrambler.js");
const e_js_1 = require("./e.js");
const scrambler_js_1 = require("./scrambler.js");
function encrypt(PIN, privateKey) {
    const userNonce = (0, protocol_js_1.generateUniqueRandomString)();
    const protocolNonce = (0, protocol_js_1.generateUniqueRandomString)();
    const userSecret = (0, scrambler_js_1.scramblePin)(PIN, userNonce);
    const privateKeyPassword = (0, privateScrambler_js_1.deterministicScrambler)(userSecret, protocolNonce);
    const keypair = privateKey;
    const value = (0, e_js_1.encryptDerive)(privateKeyPassword, protocolNonce, keypair);
    const password = (0, e_js_1.decryptDerive)(privateKeyPassword, protocolNonce, value);
    return {
        userNonce,
        protocolNonce,
        PIN,
        value
    };
}
exports.encrypt = encrypt;
