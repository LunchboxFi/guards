import * as multisig from "@sqds/multisig";
import { Connection, clusterApiUrl, PublicKey, SystemProgram, LAMPORTS_PER_SOL, TransactionMessage, } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import fs from "fs";
// Cluster Connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const createKey = new PublicKey("7ZAdU1VQiKPZS4xq84mJ3rK7JoNDY1Ta8NS8Rn5fmJkR");
const publicKey = new PublicKey("8udd3YR2vHN69zqHfgrAGAZuqhVAMpC2mU3RVe2q1Wzi");
const second = new web3.PublicKey("FY2MFVEfkCcifK5kAab6wctb6jeT17WzdEZvZNkW816r");
export function loadWalletKey(keypairFile) {
    const loaded = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())));
    return loaded;
}
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
            lamports: 0.2 * LAMPORTS_PER_SOL,
        };
        const transferInstruction = SystemProgram.transfer(transferParams);
        const testTransferMessage = new TransactionMessage({
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
