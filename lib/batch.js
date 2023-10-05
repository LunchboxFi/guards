import * as multisig from "@sqds/multisig";
import { Keypair, Connection, clusterApiUrl, PublicKey, AddressLookupTableProgram } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { TransactionMessage, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createTestTransferInstruction, range } from "./utils.js";
import fs from 'fs';
// Cluster Connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const { value: { blockhash }, context: { slot }, } = await connection.getLatestBlockhashAndContext("finalized");
const createKey = new PublicKey('Bd285EDb8HyJGgvrJ3rYhv2XjxRoRqGDyBXTugxNpdvH');
const members = {
    almighty: new PublicKey('8Hs2MzJAuWXt57LKcTsYQaRCZyNUeuyuGHrfAzYQSLDv'),
    proposer: new PublicKey('FY2MFVEfkCcifK5kAab6wctb6jeT17WzdEZvZNkW816r'),
};
export function loadWalletKey(keypairFile) {
    // const fs = require("fs");
    const loaded = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())));
    return loaded;
}
const creator = loadWalletKey("mint.json");
// Fee payer is the a signer that pays the transaction fees
const feePayer = Keypair.generate();
// Derive the multisig PDA
const multisigPda = multisig.getMultisigPda({
    // The createKey has to be a Public Key, see accounts reference for more info
    createKey,
})[0];
let multisigAccount = await multisig.accounts.accountProviders.Multisig.fromAccountAddress(connection, multisigPda);
// console.log(multisigAccount)
const [lookupTableIx, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
    authority: feePayer.publicKey,
    payer: feePayer.publicKey,
    recentSlot: slot,
});
const testTransactionMessages = [];
const vaultIndex = 2;
const batchIndex = multisig.utils.toBigInt(multisigAccount.transactionIndex) + 1n;
const [proposalPda] = multisig.getProposalPda({
    multisigPda,
    transactionIndex: batchIndex,
});
// Default vault, index 0.
const [vaultPda] = multisig.getVaultPda({
    multisigPda,
    index: 0,
});
const lookupTableAccount = await connection
    .getAddressLookupTable(lookupTableAddress)
    .then((res) => res);
const batchTransferIxs = Object.values(members).map((member) => createTestTransferInstruction(vaultPda, member, LAMPORTS_PER_SOL));
testTransactionMessages.push({
    message: new TransactionMessage({
        payerKey: vaultPda,
        recentBlockhash: blockhash,
        instructions: batchTransferIxs,
    }),
    addressLookupTableAccounts: [],
});
const createProposalSignature = await multisig.rpc.batchCreate({
    connection,
    feePayer: creator,
    multisigPda,
    batchIndex,
    creator,
    vaultIndex,
    memo: "Send funds to SOS",
});
await connection.confirmTransaction(createProposalSignature);
// Initialize the proposal for the batch.
let signature = await multisig.rpc.proposalCreate({
    connection,
    feePayer: creator,
    multisigPda,
    transactionIndex: batchIndex,
    creator: creator,
    isDraft: true,
});
console.log(signature);
await connection.confirmTransaction(signature);
// Add transactions to the batch.
for (const [index, { message, addressLookupTableAccounts },] of testTransactionMessages.entries()) {
    signature = await multisig.rpc.batchAddTransaction({
        connection,
        feePayer: creator,
        multisigPda,
        member: creator,
        vaultIndex: 0,
        batchIndex,
        // Batch transaction indices start at 1.
        transactionIndex: index + 1,
        ephemeralSigners: 0,
        transactionMessage: message,
        addressLookupTableAccounts,
    });
    await connection.confirmTransaction(signature);
}
signature = await multisig.rpc.proposalActivate({
    connection,
    feePayer: creator,
    multisigPda,
    member: creator,
    transactionIndex: batchIndex,
    signers: [creator.publicKey]
});
await connection.confirmTransaction(signature);
signature = await multisig.rpc.proposalApprove({
    connection,
    feePayer: creator,
    multisigPda,
    member: creator,
    transactionIndex: batchIndex,
    memo: "LGTM",
});
await connection.confirmTransaction(signature);
const preBalances = [];
for (const member of Object.values(members)) {
    const balance = await connection.getBalance(member);
    preBalances.push(balance);
}
for (const transactionIndex of range(1, testTransactionMessages.length)) {
    console.log(multisigPda);
    signature = await multisig.rpc.batchExecuteTransaction({
        connection,
        feePayer: creator,
        multisigPda,
        member: creator,
        batchIndex,
        transactionIndex,
    });
    await connection.confirmTransaction(signature);
    console.log(signature);
}
const proposalAccount = await multisig.accounts.accountProviders.Proposal.fromAccountAddress(connection, proposalPda);
console.log(proposalAccount);
