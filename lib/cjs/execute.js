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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWalletKey = void 0;
const multisig = __importStar(require("@sqds/multisig"));
const web3_js_1 = require("@solana/web3.js");
const web3 = __importStar(require("@solana/web3.js"));
const fs_1 = __importDefault(require("fs"));
// Cluster Connection
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
const createKey = new web3_js_1.PublicKey("7ZAdU1VQiKPZS4xq84mJ3rK7JoNDY1Ta8NS8Rn5fmJkR");
const publicKey = new web3_js_1.PublicKey("8udd3YR2vHN69zqHfgrAGAZuqhVAMpC2mU3RVe2q1Wzi");
const second = new web3.PublicKey("FY2MFVEfkCcifK5kAab6wctb6jeT17WzdEZvZNkW816r");
function loadWalletKey(keypairFile) {
    const loaded = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs_1.default.readFileSync(keypairFile).toString())));
    return loaded;
}
exports.loadWalletKey = loadWalletKey;
const creator = loadWalletKey("mint.json");
// Derive the multisig PDA
const multisigPda = multisig.getMultisigPda({
    createKey,
})[0];
async function getAccountInfo(connection, publicKey) {
    const info = await connection.getAccountInfo(publicKey);
    return info;
}
(async () => {
    try {
        let multisigAccount = await multisig.accounts.accountProviders.Multisig.fromAccountAddress(connection, multisigPda);
        const [vaultPda] = multisig.getVaultPda({
            multisigPda,
            index: 1,
        });
        console.log("Vault " + vaultPda);
        const transactionIndex = multisig.utils.toBigInt(multisigAccount.transactionIndex) + 1n;
        console.log(transactionIndex);
        const [transactionPda] = multisig.getTransactionPda({
            multisigPda,
            index: transactionIndex,
        });
        const transferParams = {
            fromPubkey: vaultPda,
            toPubkey: publicKey,
            lamports: 0.2 * web3_js_1.LAMPORTS_PER_SOL,
        };
        const transferInstruction = web3_js_1.SystemProgram.transfer(transferParams);
        const testTransferMessage = new web3_js_1.TransactionMessage({
            payerKey: vaultPda,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [transferInstruction],
        });
        let signature = await multisig.rpc.vaultTransactionCreate({
            connection,
            feePayer: creator,
            multisigPda,
            transactionIndex,
            creator: creator.publicKey,
            vaultIndex: 1,
            ephemeralSigners: 0,
            transactionMessage: testTransferMessage,
        });
        await connection.confirmTransaction(signature);
        console.log(signature);
        signature = await multisig.rpc.proposalCreate({
            connection,
            feePayer: creator,
            multisigPda,
            transactionIndex,
            creator: creator,
            isDraft: true,
        });
        await connection.confirmTransaction(signature);
        console.log(signature);
        const [proposalPda] = multisig.getProposalPda({
            multisigPda,
            transactionIndex,
        });
        console.log(proposalPda);
        signature = await multisig.rpc.proposalActivate({
            connection,
            feePayer: creator,
            multisigPda,
            member: creator,
            transactionIndex,
        });
        await connection.confirmTransaction(signature);
        signature = await multisig.rpc.proposalApprove({
            connection,
            feePayer: creator,
            multisigPda,
            member: creator,
            transactionIndex,
            memo: "First transaction",
        });
        await connection.confirmTransaction(signature);
        console.log("Approved " + signature);
        // Check if the vault transaction execute account exists before executing
        console.log(transactionIndex);
        signature = await multisig.rpc.vaultTransactionExecute({
            connection,
            feePayer: creator,
            multisigPda,
            transactionIndex,
            member: creator.publicKey,
        });
        await connection.confirmTransaction(signature);
        console.log(signature);
    }
    catch (error) {
        console.error("Error:", error);
    }
})();
