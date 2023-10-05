"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMultisigAccount = void 0;
const multisig = __importStar(require("@sqds/multisig"));
const web3_js_1 = require("@solana/web3.js");
async function fetchMultisigAccount(multisigBs58, RPC) {
    try {
        const multisigPda = new web3_js_1.PublicKey(multisigBs58);
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(RPC), "confirmed");
        const multisigAccount = await multisig.accounts.accountProviders.Multisig.fromAccountAddress(connection, multisigPda);
        // Log out the multisig's members
        console.log(multisigAccount);
        return multisigAccount;
    }
    catch (error) {
        console.error("Error fetching multisig account:", error);
    }
}
exports.fetchMultisigAccount = fetchMultisigAccount;
// Call the async function to fetch the multisig account
// fetchMultisigAccount("7pg8n82ccrsQs4CFFFT2xJhj2P1FrweQzysAqbryuWTw", "devnet");
