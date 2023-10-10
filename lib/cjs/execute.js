"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("./utils.js");
const key = (0, utils_js_1.loadWalletKey)('sol.json');
console.log(key.publicKey);
