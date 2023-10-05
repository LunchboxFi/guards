import { Connection, PublicKey, SystemProgram, TransactionMessage, clusterApiUrl, LAMPORTS_PER_SOL, } from "@solana/web3.js";
import { loadWalletKey } from "./utils.js";
import * as multisig from "@sqds/multisig"; // Replace with the correct import path
async function transferSOL(RPC, memberOne, to, createKey, amount, signers) {
    try {
        const connection = new Connection(clusterApiUrl(RPC), "confirmed");
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
            lamports: amount * LAMPORTS_PER_SOL,
        };
        const [transactionPda] = multisig.getTransactionPda({
            multisigPda,
            index: transactionIndex,
        });
        const transferInstruction = SystemProgram.transfer(transferParams);
        const testTransferMessage = new TransactionMessage({
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
// Example usage:
// Replace the placeholders with actual values
const RPC = "devnet";
const to = new PublicKey("8D2AoV1TqSLN3GKFJD1tujiK8RK9RGkkkwug1McKStiC");
const memberOne = loadWalletKey("mint.json");
const amount = 0.02; // Amount in SOL
const signers = [memberOne]; // Load your keypair
const createKey = new PublicKey("7ZAdU1VQiKPZS4xq84mJ3rK7JoNDY1Ta8NS8Rn5fmJkR");
transferSOL(RPC, memberOne, to, createKey, amount, signers);
