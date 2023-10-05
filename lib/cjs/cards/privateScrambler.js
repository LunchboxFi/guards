"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deterministicScrambler = void 0;
//this is the private scrambler that will be built using light's private solana programs
const crypto_1 = __importDefault(require("crypto"));
function deterministicScrambler(value1, value2) {
    // Concatenate the two values
    // Create a secret key for HMAC based on the randomString
    const secretKey = crypto_1.default.createHash('sha256').update(value1).digest();
    // Calculate the HMAC of the combined value using the secret key
    const hmac = crypto_1.default.createHmac('sha256', secretKey);
    hmac.update(value2.toString());
    // The scrambled result will be the hexadecimal representation of the HMAC
    const scrambledResult = hmac.digest('hex');
    return scrambledResult;
}
exports.deterministicScrambler = deterministicScrambler;
// Example usage:
const value1 = '0378390e4d2ec4cd0283423d1c403b2577659bd6637386d42e86267d5b392c2d';
const value2 = '5LUGQ6f=h=fZxhpn';
// const scrambledResult = deterministicScrambler(value1, value2);
// console.log('Scrambled Result:', scrambledResult);
