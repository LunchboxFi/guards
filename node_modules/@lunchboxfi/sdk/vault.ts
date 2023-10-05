import * as multisig from "@sqds/multisig";
import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";


const connection = new Connection( clusterApiUrl('devnet'),'confirmed');

const address = new PublicKey('GZXkcGWvqAz89eK9wuAvqUS3ucpZDFXbseFz6Du9Q9uj');
console.log(address)

const multisigAccount = await multisig.accounts.accountProviders.Batch.fromAccountAddress(
    connection,
    address
  );
// Log out the multisig's members
console.log("Members", multisigAccount);