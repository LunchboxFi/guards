import { PublicKey, Keypair } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
export declare function transferSOL(RPC: web3.Cluster, memberOne: Keypair, to: PublicKey, multisigPubkey: PublicKey, amount: number, signers: web3.Keypair[]): Promise<void>;
