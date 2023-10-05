import crypto from 'crypto';
export function scramblePin(pin, randomString) {
    // Create a secret key for HMAC based on the randomString
    const secretKey = crypto.createHash('sha256').update(randomString).digest();
    // Calculate the HMAC of the PIN using the secret key
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(pin.toString()); // Convert PIN to a string before hashing
    // The scrambled PIN will be the hexadecimal representation of the HMAC
    const scrambledPin = hmac.digest('hex');
    return scrambledPin;
}
// Example usage:
const pin = 5373; // Your 4-digit PIN
const randomString = 'Er3df4%@#Q'; // Random string
const scrambledPin = scramblePin(pin, randomString);
// console.log('Scrambled PIN:', scrambledPin);
