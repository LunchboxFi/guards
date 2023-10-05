import * as multisig from "@sqds/multisig";
import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import fs from 'fs'

// Cluster Connection
const connection = new Connection( clusterApiUrl('devnet'),'confirmed');
const createKey = new PublicKey('Bd285EDb8HyJGgvrJ3rYhv2XjxRoRqGDyBXTugxNpdvH');

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

console.log(multisigPda)

const transactionIndex = 2n;

const createProposalSignature = await multisig.rpc.proposalCreate({
    connection,
    feePayer: creator,
    multisigPda,
    transactionIndex,
    creator: creator,
});

await connection.confirmTransaction(createProposalSignature);