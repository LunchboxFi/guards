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
const multisig = __importStar(require("@sqds/multisig"));
const web3_js_1 = require("@solana/web3.js");
const assert_1 = __importDefault(require("assert"));
const utils_js_1 = require("./utils.js");
const { Multisig, Proposal } = multisig.accounts.accountProviders;
const connection = (0, utils_js_1.createLocalhostConnection)();
let members;
(async () => {
    members = await (0, utils_js_1.generateMultisigMembers)(connection);
});
async () => {
    // Use a different fee payer for the batch execution to isolate member balance changes.
    const feePayer = await (0, utils_js_1.generateFundedKeypair)(connection);
    const [multisigPda] = await (0, utils_js_1.createAutonomousMultisig)({
        connection,
        members,
        threshold: 2,
        timeLock: 0,
    });
    let multisigAccount = await Multisig.fromAccountAddress(connection, multisigPda);
    const vaultIndex = 0;
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
    // Prepare transactions for the batch.
    // We are going to make a payout of 1 SOL to every member of the multisig
    // first as a separate transaction per member, then in a single transaction
    // that also uses an Account Lookup Table containing all member addresses.
    // Airdrop SOL amount required for the payout to the Vault.
    const airdropSig = await connection.requestAirdrop(vaultPda, 
    // Each member will be paid 2 x 1 SOL.
    Object.keys(members).length * 2 * web3_js_1.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSig);
    const { value: { blockhash }, context: { slot }, } = await connection.getLatestBlockhashAndContext("finalized");
    const testTransactionMessages = [];
    for (const member of Object.values(members)) {
        const ix = (0, utils_js_1.createTestTransferInstruction)(vaultPda, member.publicKey, web3_js_1.LAMPORTS_PER_SOL);
        testTransactionMessages.push({
            message: new web3_js_1.TransactionMessage({
                payerKey: vaultPda,
                recentBlockhash: blockhash,
                instructions: [ix],
            }),
            addressLookupTableAccounts: [],
        });
    }
    // Create a lookup table with all member addresses.
    const memberAddresses = Object.values(members).map((m) => m.publicKey);
    const [lookupTableIx, lookupTableAddress] = web3_js_1.AddressLookupTableProgram.createLookupTable({
        authority: feePayer.publicKey,
        payer: feePayer.publicKey,
        recentSlot: slot,
    });
    const extendTableIx = web3_js_1.AddressLookupTableProgram.extendLookupTable({
        payer: feePayer.publicKey,
        authority: feePayer.publicKey,
        lookupTable: lookupTableAddress,
        addresses: [web3_js_1.SystemProgram.programId, ...memberAddresses],
    });
    const createLookupTableTx = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
        payerKey: feePayer.publicKey,
        recentBlockhash: blockhash,
        instructions: [lookupTableIx, extendTableIx],
    }).compileToV0Message());
    createLookupTableTx.sign([feePayer]);
    let signature = await connection
        .sendRawTransaction(createLookupTableTx.serialize())
        .catch((err) => {
        console.error(err.logs);
        throw err;
    });
    await connection.confirmTransaction(signature);
    const lookupTableAccount = await connection
        .getAddressLookupTable(lookupTableAddress)
        .then((res) => res.value);
    assert_1.default.ok(lookupTableAccount);
    const batchTransferIxs = Object.values(members).map((member) => (0, utils_js_1.createTestTransferInstruction)(vaultPda, member.publicKey, web3_js_1.LAMPORTS_PER_SOL));
    testTransactionMessages.push({
        message: new web3_js_1.TransactionMessage({
            payerKey: vaultPda,
            recentBlockhash: blockhash,
            instructions: batchTransferIxs,
        }),
        addressLookupTableAccounts: [lookupTableAccount],
    });
    // Create a batch account.
    signature = await multisig.rpc.batchCreate({
        connection,
        feePayer: members.proposer,
        multisigPda,
        creator: members.proposer,
        batchIndex,
        vaultIndex,
        memo: "Distribute funds to members",
    });
    await connection.confirmTransaction(signature);
    // Initialize the proposal for the batch.
    signature = await multisig.rpc.proposalCreate({
        connection,
        feePayer: members.proposer,
        multisigPda,
        transactionIndex: batchIndex,
        creator: members.proposer,
        isDraft: true,
    });
    await connection.confirmTransaction(signature);
    // Add transactions to the batch.
    for (const [index, { message, addressLookupTableAccounts },] of testTransactionMessages.entries()) {
        signature = await multisig.rpc.batchAddTransaction({
            connection,
            feePayer: members.proposer,
            multisigPda,
            member: members.proposer,
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
    // Activate the proposal (finalize the batch).
    signature = await multisig.rpc.proposalActivate({
        connection,
        feePayer: members.proposer,
        multisigPda,
        member: members.proposer,
        transactionIndex: batchIndex,
    });
    await connection.confirmTransaction(signature);
    // First approval for the batch proposal.
    signature = await multisig.rpc.proposalApprove({
        connection,
        feePayer: members.voter,
        multisigPda,
        member: members.voter,
        transactionIndex: batchIndex,
        memo: "LGTM",
    });
    await connection.confirmTransaction(signature);
    // Second approval for the batch proposal.
    signature = await multisig.rpc.proposalApprove({
        connection,
        feePayer: members.almighty,
        multisigPda,
        member: members.almighty,
        transactionIndex: batchIndex,
        memo: "LGTM too",
    });
    await connection.confirmTransaction(signature);
    // Fetch the member balances before the batch execution.
    const preBalances = [];
    for (const member of Object.values(members)) {
        const balance = await connection.getBalance(member.publicKey);
        preBalances.push(balance);
    }
    // Execute the transactions from the batch sequentially one-by-one.
    for (const transactionIndex of (0, utils_js_1.range)(1, testTransactionMessages.length)) {
        signature = await multisig.rpc.batchExecuteTransaction({
            connection,
            feePayer: feePayer,
            multisigPda,
            member: members.executor,
            batchIndex,
            transactionIndex,
        });
        await connection.confirmTransaction(signature);
        console.log(signature);
    }
    // Proposal status must be "Executed".
    const proposalAccount = await Proposal.fromAccountAddress(connection, proposalPda);
    console.log(proposalAccount);
    assert_1.default.ok(multisig.types.isProposalStatusExecuted(proposalAccount.status));
    // Verify that the members received the funds.
    // for (const [index, preBalance] of preBalances.entries()) {
    //   const postBalance = await connection.getBalance(
    //     Object.values(members)[index].publicKey
    //   );
    //   assert.strictEqual(postBalance, preBalance + 2 * LAMPORTS_PER_SOL);
    // }
};
