"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueRandomString = void 0;
const crypto_1 = __importDefault(require("crypto"));
function generateUniqueRandomString() {
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const allCharacters = symbols + lowercaseLetters + uppercaseLetters;
    // Generate a unique timestamp-based string (milliseconds since epoch)
    const uniquePart = Date.now().toString(36);
    // Generate random characters to fill the remaining length
    const randomPart = crypto_1.default.randomBytes(12 - uniquePart.length).toString('base64');
    // Combine the unique and random parts
    const combinedString = uniquePart + randomPart;
    // Shuffle the characters to make it more random
    const shuffledString = shuffleString(combinedString);
    return shuffledString;
}
exports.generateUniqueRandomString = generateUniqueRandomString;
function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}
// Generate a unique random string
const uniqueRandomString = generateUniqueRandomString();
// console.log('Unique Random String:', uniqueRandomString);
