import * as multisig from "@sqds/multisig";
import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";


const createKey = new PublicKey('AkKrH4DA2Cr8VcU47KnjHwpUYyMbCMJGaLnAKyFW4ADv')
const connection = new Connection( clusterApiUrl('devnet'),'confirmed');
const [multisigPda] = multisig.getMultisigPda({
    createKey,
});


const multisigAccount = await multisig.accounts.accountProviders.Multisig.fromAccountAddress(
    connection,
    multisigPda
  );
// Log out the multisig's members
console.log("Members", multisigAccount.members);