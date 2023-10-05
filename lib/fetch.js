import * as multisig from "@sqds/multisig";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
export async function fetchMultisigAccount(multisigBs58, RPC) {
    try {
        const multisigPda = new PublicKey(multisigBs58);
        const connection = new Connection(clusterApiUrl(RPC), "confirmed");
        const multisigAccount = await multisig.accounts.accountProviders.Multisig.fromAccountAddress(connection, multisigPda);
        // Log out the multisig's members
        console.log(multisigAccount);
        return multisigAccount;
    }
    catch (error) {
        console.error("Error fetching multisig account:", error);
    }
}
// Call the async function to fetch the multisig account
// fetchMultisigAccount("7pg8n82ccrsQs4CFFFT2xJhj2P1FrweQzysAqbryuWTw", "devnet");
