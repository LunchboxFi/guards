import * as multisig from "@sqds/multisig";
import { Keypair, Connection, clusterApiUrl, PublicKey, SystemProgram, LAMPORTS_PER_SOL, TransactionMessage } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import fs from 'fs'

// Cluster Connection
const connection = new Connection( clusterApiUrl('devnet'),'confirmed');
const createKey = new PublicKey('6Hu1APvyFLSqxQdkyjaLpXNzfAnZd3ZoArE6tPpZog9B');

const publicKey = new PublicKey('8udd3YR2vHN69zqHfgrAGAZuqhVAMpC2mU3RVe2q1Wzi');

export function loadWalletKey(keypairFile:string): web3.Keypair {
    // const fs = require("fs");
    const loaded = web3.Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())),
    );
    return loaded;
  }

const creator = loadWalletKey("mint.json")
// Fee payer is the a signer that pays the transaction fees
const feePayer = Keypair.generate()
// Derive the multisig PDA
const multisigPda = multisig.getMultisigPda({
    // The createKey has to be a Public Key, see accounts reference for more info
    createKey,
})[0];

let multisigAccount = await multisig.accounts.accountProviders.Multisig.fromAccountAddress(
  connection,
  multisigPda
);

// const transactionIndex = 1;

// const [proposalPda] = multisig.getProposalPda({
//     multisigPda,
//     transactionIndex: batchIndex,
//   });

const [vaultPda] = multisig.getVaultPda({
    multisigPda,
    index: 1,
  });

  console.log("Vault " + vaultPda)

  const transactionIndex =
  multisig.utils.toBigInt(multisigAccount.transactionIndex) + 1n;
  console.log(transactionIndex)

  const [transactionPda] = multisig.getTransactionPda({
    multisigPda,
    index: transactionIndex,
  });

  console.log(transactionPda)

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
    vaultIndex: 0,
    ephemeralSigners: 0,
    transactionMessage: testTransferMessage,
});
await connection.confirmTransaction(signature);

console.log(signature)


 signature = await multisig.rpc.proposalCreate({
  connection,
  feePayer: creator,
  multisigPda,
  transactionIndex,
  creator: creator,
  isDraft: true,
});

await connection.confirmTransaction(signature);

console.log(signature)

const [proposalPda] = multisig.getProposalPda({
  multisigPda,
  transactionIndex,
});

console.log(proposalPda)

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
console.log("Approved "+ signature)


signature = await multisig.rpc.vaultTransactionExecute({
  connection,
  feePayer: creator,
  multisigPda,
  transactionIndex,
  member: creator.publicKey,
});
await connection.confirmTransaction(signature);

console.log(signature)


