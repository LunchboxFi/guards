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
const multisig = __importStar(require("@sqds/multisig"));
const web3_js_1 = require("@solana/web3.js");
const utils_js_1 = require("./utils.js");
const types_js_1 = require("@sqds/multisig/lib/types.js");
// Cluster Connection
async function addSpendingLimit(multisigPda, Cluster, token) {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(Cluster), "confirmed");
    // Fee payer is the signer that pays the transaction fees
    const feePayer = (0, utils_js_1.loadWalletKey)('mint.json');
    const creator = (0, utils_js_1.loadWalletKey)('mint.json');
    const spendingLimitCreateKey = web3_js_1.Keypair.generate().publicKey;
    const spendingLimitPda = multisig.getSpendingLimitPda({
        multisigPda,
        createKey: spendingLimitCreateKey,
    })[0];
    try {
        await multisig.rpc.multisigAddSpendingLimit({
            connection,
            feePayer,
            // The multisig account Public Key
            multisigPda,
            // The spending limit account Public Key
            spendingLimit: spendingLimitPda,
            createKey: spendingLimitCreateKey,
            // Rent payer for state
            rentPayer: feePayer,
            // Spending limit amount
            amount: BigInt(1000000000),
            configAuthority: creator.publicKey,
            // Spending limit will apply daily, see reference for more info
            period: types_js_1.Period.Day,
            // The mint of the token to apply the spending limit on
            mint: token,
            destinations: [],
            // null means it will apply to all members, make it an array of Public Keys to specify certain members
            members: [],
            vaultIndex: 1,
        });
        console.log('Spending limit added successfully.');
    }
    catch (error) {
        console.error('Error adding spending limit:', error);
    }
}
// Call the async function to add the spending limit
const multisigPda = new web3_js_1.PublicKey("Hj69gNWbK8MHodiHbbvkTTzPTMz7jarDciGdjujx1sM4");
const token = new web3_js_1.PublicKey("11111111111111111111111111111111");
addSpendingLimit(multisigPda, "devnet", token);
