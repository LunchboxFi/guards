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
async function transferSOL(RPC, memberOne, to, multisigPubkey, amount, signers) {
    try {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(RPC), "confirmed");
        const multisigAccount = await multisig.accounts.accountProviders.Multisig.fromAccountAddress(connection, multisigPubkey);
        let KEYPAIR = [212, 243, 134, 229, 121, 198, 6, 168, 223, 223, 58, 152, 186, 16, 127, 173, 23, 131, 31, 195, 80, 109, 186, 100, 26, 205, 202, 115, 233, 15, 251, 176, 108, 83, 169, 196, 205, 75, 119, 116, 36, 134, 138, 127, 239, 29, 174, 6, 136, 197, 90, 169, 127, 17, 209, 224, 2, 114, 74, 149, 188, 176, 144, 17];
        const payer = (0, utils_js_1.loadWalletKeypair)(KEYPAIR);
        const [vaultPda] = multisig.getVaultPda({
            multisigPda: multisigPubkey,
            index: 1,
        });
        console.log("Vault: " + vaultPda.toBase58());
        const transactionIndex = multisig.utils.toBigInt(multisigAccount.transactionIndex) + 1n;
        const transferParams = {
            fromPubkey: vaultPda,
            toPubkey: to,
            lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
        };
        const [transactionPda] = multisig.getTransactionPda({
            multisigPda: multisigPubkey,
            index: transactionIndex,
        });
        console.log(transactionPda);
        const transferInstruction = web3_js_1.SystemProgram.transfer(transferParams);
        const testTransferMessage = new web3_js_1.TransactionMessage({
            payerKey: vaultPda,
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
            instructions: [transferInstruction],
        });
        let signature = await multisig.rpc.vaultTransactionCreate({
            connection,
            feePayer: payer,
            multisigPda: multisigPubkey,
            transactionIndex,
            creator: memberOne.publicKey,
            vaultIndex: 1,
            ephemeralSigners: 0,
            transactionMessage: testTransferMessage,
        });
        await connection.confirmTransaction(signature);
        signature = await multisig.rpc.proposalCreate({
            connection,
            feePayer: payer,
            multisigPda: multisigPubkey,
            transactionIndex,
            creator: memberOne,
            isDraft: true,
        });
        await connection.confirmTransaction(signature);
        const [proposalPda] = multisig.getProposalPda({
            multisigPda: multisigPubkey,
            transactionIndex,
        });
        console.log(proposalPda);
        signature = await multisig.rpc.proposalActivate({
            connection,
            feePayer: payer,
            multisigPda: multisigPubkey,
            member: memberOne,
            transactionIndex,
        });
        await connection.confirmTransaction(signature);
        console.log("First approve: " + signature);
        signature = await multisig.rpc.proposalApprove({
            connection,
            feePayer: payer,
            multisigPda: multisigPubkey,
            member: memberOne,
            transactionIndex,
            memo: "First transaction",
        });
        await connection.confirmTransaction(signature);
        signature = await multisig.rpc.proposalApprove({
            connection,
            feePayer: payer,
            multisigPda: multisigPubkey,
            member: signers[1],
            transactionIndex,
            memo: "First transaction",
        });
        await connection.confirmTransaction(signature);
        console.log("Second approve: " + signature);
        signature = await multisig.rpc.vaultTransactionExecute({
            connection,
            feePayer: payer,
            multisigPda: multisigPubkey,
            transactionIndex,
            member: memberOne.publicKey,
        });
        await connection.confirmTransaction(signature);
        console.log(signature);
        return signature;
    }
    catch (error) {
        console.error("Error:", error);
    }
}
exports.transferSOL = transferSOL;
// Example usage:
// Replace the placeholders with actual values
// const RPC = "devnet"
// const to = new PublicKey("8D2AoV1TqSLN3GKFJD1tujiK8RK9RGkkkwug1McKStiC");
// const memberOne = loadWalletKey("mint.json");
// const memberTwo = loadWalletKey("sol.json");
// const amount = 0.02; // Amount in SOL
// const signers = [memberOne, memberTwo]; // Load your keypair
// const multisigPubkey = new PublicKey("FPr8TrG5Hfp4dFFxA4ZivbBk5PbzDRueoMeXTYSDZWps");
// transferSOL( RPC, memberOne, to, multisigPubkey, amount, signers);
