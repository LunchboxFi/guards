import { loadWalletKey } from "./utils.js";
const key = loadWalletKey('sol.json');
console.log(key.publicKey);
