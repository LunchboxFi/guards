import * as multisig from "@sqds/multisig";
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import * as web3 from "@solana/web3.js";
import { Permission, Permissions } from "@sqds/multisig/lib/types.js";
import { loadWalletKey } from "./utils.js";
import bs58 from "bs58";
// Cluster Connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
// Random Public Key that will be used to derive a multisig PDA
const createKey = Keypair.generate();
console.log(createKey.publicKey.toBase58());
const second = Keypair.generate().publicKey;
const second1 = new web3.PublicKey('FY2MFVEfkCcifK5kAab6wctb6jeT17WzdEZvZNkW816r');
// Creator should be a Keypair or a Wallet Adapter wallet
const creator = loadWalletKey("mint.json");
console.log(bs58.encode(creator.secretKey));
// Derive the multisig PDA
const [multisigPda] = multisig.getMultisigPda({ createKey: createKey.publicKey });
async function createMultisigAndPrintSignature() {
    try {
        const signature = await multisig.rpc.multisigCreate({
            connection,
            // One-time random Key
            createKey,
            // The creator & fee payer
            creator,
            // The PDA of the multisig you are creating, derived by a random PublicKey
            multisigPda,
            // Here the config authority will be the system program
            configAuthority: null,
            // Create without any time-lock
            threshold: 1,
            // List of the members to add to the multisig
            members: [
                {
                    // Members Public Key
                    key: creator.publicKey,
                    // Members permissions inside the multisig
                    permissions: Permissions.all(),
                },
                {
                    // Members Public Key
                    key: second1,
                    // Members permissions inside the multisig
                    permissions: Permissions.fromPermissions([Permission.Execute]),
                },
                {
                    // Members Public Key
                    key: second1,
                    // Protocols key to store data
                    permissions: Permissions.fromPermissions([Permission.Vote]),
                }
            ],
            // This means that there need to be 2 votes for a transaction proposal to be approved
            timeLock: 0,
        });
        console.log("Multisig created. Signature: ", signature, "MultiSig:" + multisigPda.toBase58());
    }
    catch (error) {
        console.error("Error creating multisig:", error);
    }
}
// Call the async function to create the multisig and print the signature
createMultisigAndPrintSignature();
