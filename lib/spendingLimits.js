import * as multisig from "@sqds/multisig";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Period } from "@sqds/multisig/lib/types.js";
// Cluster Connection
export async function addSpendingLimit(multisigPda, Cluster, token) {
    const connection = new Connection(clusterApiUrl(Cluster), "confirmed");
    // Fee payer is the signer that pays the transaction fees
    const feePayer = Keypair.generate();
    const creator = Keypair.generate();
    const spendingLimitCreateKey = Keypair.generate().publicKey;
    const spendingLimitPda = multisig.getSpendingLimitPda({
        multisigPda,
        createKey: spendingLimitCreateKey,
    })[0];
    try {
        await multisig.rpc.multisigAddSpendingLimit({
            connection,
            feePayer,
            // The multisig account Public Key
            multisigPda,
            // The spending limit account Public Key
            spendingLimit: spendingLimitPda,
            createKey: spendingLimitCreateKey,
            // Rent payer for state
            rentPayer: feePayer,
            // Spending limit amount
            amount: BigInt(1000000000),
            configAuthority: creator.publicKey,
            // Spending limit will apply daily, see reference for more info
            period: Period.Day,
            // The mint of the token to apply the spending limit on
            mint: token,
            destinations: [],
            // null means it will apply to all members, make it an array of Public Keys to specify certain members
            members: [],
            vaultIndex: 1,
        });
        console.log('Spending limit added successfully.');
    }
    catch (error) {
        console.error('Error adding spending limit:', error);
    }
}
// Call the async function to add the spending limit
const multisigPda = new PublicKey("Hj69gNWbK8MHodiHbbvkTTzPTMz7jarDciGdjujx1sM4");
const token = new PublicKey("11111111111111111111111111111111");
// addSpendingLimit(multisigPda, "devnet", token);
