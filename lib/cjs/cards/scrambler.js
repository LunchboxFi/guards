"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scramblePin = void 0;
const crypto_1 = __importDefault(require("crypto"));
function scramblePin(pin, randomString) {
    // Create a secret key for HMAC based on the randomString
    const secretKey = crypto_1.default.createHash('sha256').update(randomString).digest();
    // Calculate the HMAC of the PIN using the secret key
    const hmac = crypto_1.default.createHmac('sha256', secretKey);
    hmac.update(pin.toString()); // Convert PIN to a string before hashing
    // The scrambled PIN will be the hexadecimal representation of the HMAC
    const scrambledPin = hmac.digest('hex');
    return scrambledPin;
}
exports.scramblePin = scramblePin;
// Example usage:
const pin = 5373; // Your 4-digit PIN
const randomString = 'Er3df4%@#Q'; // Random string
const scrambledPin = scramblePin(pin, randomString);
// console.log('Scrambled PIN:', scrambledPin);
