"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOwnership = void 0;
const crypto_1 = __importDefault(require("crypto"));
const big_integer_1 = __importDefault(require("big-integer"));
function verifyOwnership(pHex, gHex) {
    const buffer = Buffer.from(gHex, 'utf-8');
    const hexString = buffer.toString('hex');
    // Convert parameters from hexadecimal to decimal
    const p = (0, big_integer_1.default)(pHex, 16);
    const g = (0, big_integer_1.default)(hexString, 16);
    // Party A
    const a = crypto_1.default.randomBytes(16); // Private key for party A
    const aBigInt = (0, big_integer_1.default)(a.toString('hex'), 16); // Convert a to BigInt
    const A = g.modPow(aBigInt, p); // Public key for party A
    // Party B
    const b = crypto_1.default.randomBytes(16); // Private key for party B
    const bBigInt = (0, big_integer_1.default)(b.toString('hex'), 16); // Convert b to BigInt
    const B = g.modPow(bBigInt, p); // Public key for party B
    // Exchange public keys (A and B)
    // Party A computes the shared secret
    const sharedSecretA = B.modPow(aBigInt, p);
    // Party B computes the shared secret
    const sharedSecretB = A.modPow(bBigInt, p);
    const Astring = sharedSecretA.toString(16);
    const Ahex = Buffer.from(Astring, 'utf-8').toString('hex');
    const Bstring = sharedSecretB.toString(16);
    const Bhex = Buffer.from(Bstring, 'utf-8').toString('hex');
    const result = parseInt(Ahex, 16) / parseInt(Bhex, 16);
    if (result === 1) {
        return true;
    }
    return false;
}
exports.verifyOwnership = verifyOwnership;
// Example usage:
const pHex = '0378390e4d2ec4cd0283423d1c403b2577659bd6637386d42e86267d5b392c2d';
const gHex = '5LUGQ6f=h=fZxhpn';
//   const divisionResult = calculateDivision(pHex, gHex);
//   console.log('Division Result:', divisionResult);
