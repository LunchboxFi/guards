import * as multisig from "@sqds/multisig";
import { Cluster } from "@solana/web3.js";
export declare function fetchMultisigAccount(multisigBs58: string, RPC: Cluster): Promise<multisig.generated.Multisig | undefined>;
