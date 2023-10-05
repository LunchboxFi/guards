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
exports.transferSOL = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_js_1 = require("./utils.js");
const multisig = __importStar(require("@sqds/multisig")); // Replace with the correct import path
async function transferSOL(RPC, memberOne, to, createKey, amount, signers) {
    try {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(RPC), "confirmed");
        const multisigPda = multisig.getMultisigPda({
            createKey: createKey,
        })[0];
        const multisigAccount = await multisig.accounts.accountProviders.Multisig.fromAccountAddress(connection, multisigPda);
        const [vaultPda] = multisig.getVaultPda({
            multisigPda,
            index: 1,
        });
        console.log("Vault " + vaultPda);
        const transactionIndex = multisig.utils.toBigInt(multisigAccount.transactionIndex) + 1n;
        const transferParams = {
            fromPubkey: vaultPda,
            toPubkey: to,
            lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
        };
        const [transactionPda] = multisig.getTransactionPda({
            multisigPda,
            index: transactionIndex,
        });
        const transferInstruction = web3_js_1.SystemProgram.transfer(transferParams);
        const testTransferMessage = new web3_js_1.TransactionMessage({
            payerKey: vaultPda,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [transferInstruction],
        });
        let signature = await multisig.rpc.vaultTransactionCreate({
            connection,
            feePayer: signers[0],
            multisigPda,
            transactionIndex,
            creator: memberOne.publicKey,
            vaultIndex: 1,
            ephemeralSigners: 0,
            transactionMessage: testTransferMessage,
        });
        await connection.confirmTransaction(signature);
        signature = await multisig.rpc.proposalCreate({
            connection,
            feePayer: memberOne,
            multisigPda,
            transactionIndex,
            creator: memberOne,
            isDraft: true,
        });
        await connection.confirmTransaction(signature);
        const [proposalPda] = multisig.getProposalPda({
            multisigPda,
            transactionIndex,
        });
        console.log(proposalPda);
        signature = await multisig.rpc.proposalActivate({
            connection,
            feePayer: memberOne,
            multisigPda,
            member: memberOne,
            transactionIndex,
        });
        await connection.confirmTransaction(signature);
        signature = await multisig.rpc.proposalApprove({
            connection,
            feePayer: memberOne,
            multisigPda,
            member: memberOne,
            transactionIndex,
            memo: "First transaction",
        });
        await connection.confirmTransaction(signature);
        signature = await multisig.rpc.vaultTransactionExecute({
            connection,
            feePayer: memberOne,
            multisigPda,
            transactionIndex,
            member: memberOne.publicKey,
        });
        await connection.confirmTransaction(signature);
        console.log(signature);
    }
    catch (error) {
        console.error("Error:", error);
    }
}
exports.transferSOL = transferSOL;
// Example usage:
// Replace the placeholders with actual values
const RPC = "devnet";
const to = new web3_js_1.PublicKey("8D2AoV1TqSLN3GKFJD1tujiK8RK9RGkkkwug1McKStiC");
const memberOne = (0, utils_js_1.loadWalletKey)("mint.json");
const amount = 0.02; // Amount in SOL
const signers = [memberOne]; // Load your keypair
const createKey = new web3_js_1.PublicKey("7ZAdU1VQiKPZS4xq84mJ3rK7JoNDY1Ta8NS8Rn5fmJkR");
transferSOL(RPC, memberOne, to, createKey, amount, signers);
