import crypto from 'crypto';
import bigInt from 'big-integer';

// Common parameters (p and g)
const pHex = '0378390e4d2ec4cd0283423d1c403b2577659bd6637386d42e86267d5b392c2d';
const gHex = '5LUGQ6f=h=fZxhpn';

const buffer = Buffer.from(gHex, 'utf-8');
const hexString = buffer.toString('hex');

// Convert parameters from hexadecimal to decimal
const p = bigInt(pHex, 16);
const g = bigInt(hexString, 16);

// Party A
const a = crypto.randomBytes(16); // Private key for party A
const aBigInt = bigInt(a.toString('hex'), 16); // Convert a to BigInt
const A = g.modPow(aBigInt, p); // Public key for party A

// Party B
const b = crypto.randomBytes(16); // Private key for party B
const bBigInt = bigInt(b.toString('hex'), 16); // Convert b to BigInt
const B = g.modPow(bBigInt, p); // Public key for party B

// Exchange public keys (A and B)

// Party A computes the shared secret
const sharedSecretA = B.modPow(aBigInt, p);

// Party B computes the shared secret
const sharedSecretB = A.modPow(bBigInt, p);

console.log('Shared Secret A:', sharedSecretA.toString(16));
console.log('Shared Secret B:', sharedSecretB.toString(16));

