import { Keypair } from '@solana/web3.js';
import * as web3 from "@solana/web3.js";
export declare function createMultisig(RPC: web3.Cluster): Promise<{
    multisig: string;
    keypairs: Keypair[];
    signature: string;
} | undefined>;
