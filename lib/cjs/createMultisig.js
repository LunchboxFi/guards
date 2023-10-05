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
exports.createMultisig = void 0;
const multisig = __importStar(require("@sqds/multisig"));
const web3_js_1 = require("@solana/web3.js");
const types_js_1 = require("@sqds/multisig/lib/types.js");
const utils_js_1 = require("./utils.js");
async function createMultisig(RPC) {
    // Cluster Connection
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(RPC), 'confirmed');
    // Random Public Key that will be used to derive a multisig PDA
    const createKey = web3_js_1.Keypair.generate();
    const primary = web3_js_1.Keypair.generate();
    const secondary = web3_js_1.Keypair.generate();
    const advisor = web3_js_1.Keypair.generate();
    // Creator should be a Keypair or a Wallet Adapter wallet
    const creator = (0, utils_js_1.loadWalletKey)("mint.json");
    // Derive the multisig PDA
    const [multisigPda] = multisig.getMultisigPda({ createKey: createKey.publicKey });
    try {
        const signature = await multisig.rpc.multisigCreate({
            connection,
            // One-time random Key
            createKey,
            // The creator & fee payer
            creator,
            // The PDA of the multisig you are creating, derived by a random PublicKey
            multisigPda,
            // Here the config authority will be the system program
            configAuthority: primary.publicKey,
            // Create without any time-lock
            threshold: 2,
            // List of the members to add to the multisig
            members: [
                {
                    // Members Public Key
                    key: primary.publicKey,
                    // Members permissions inside the multisig
                    permissions: types_js_1.Permissions.all(),
                },
                {
                    // Members Public Key
                    key: secondary.publicKey,
                    // Members permissions inside the multisig
                    permissions: types_js_1.Permissions.fromPermissions([types_js_1.Permission.Execute]),
                },
                {
                    // Members Public Key
                    key: advisor.publicKey,
                    // Protocols key to store data
                    permissions: types_js_1.Permissions.fromPermissions([types_js_1.Permission.Vote]),
                }
            ],
            // This means that there need to be 2 votes for a transaction proposal to be approved
            timeLock: 0,
        });
        return {
            multisig: multisigPda.toBase58(),
            keypairs: [primary, secondary, advisor],
            signature: signature
        };
    }
    catch (error) {
        console.error("Error creating multisig:", error);
    }
}
exports.createMultisig = createMultisig;
// Call the async function to create the multisig and print the signature
// createMultisig("devnet")
//  .then((r) => {
//     console.log(r)
//  })
