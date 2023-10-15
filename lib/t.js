// import * as multisig from "@sqds/multisig";
// import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js'
// import * as web3 from "@solana/web3.js";
// import { Permission, Permissions } from "@sqds/multisig/lib/types.js";
// import { loadWalletKey, loadWalletKeypair } from "./utils.js";
// import fs from 'fs'
// import bs58 from "bs58";
export {};
// export async function createMultisig(RPC: web3.Cluster) {
//   // Cluster Connection
//   const connection = new Connection(clusterApiUrl(RPC),'confirmed');
//   // Random Public Key that will be used to derive a multisig PDA
//   const createKey = Keypair.generate();
//   // const primary = loadWalletKey('mint.json')
//   const secondary = Keypair.generate()
//   const advisor = Keypair.generate();
//   // Creator should be a Keypair or a Wallet Adapter wallet
//   const creator = loadWalletKey('mint.json')
//   // Derive the multisig PDA
//   const [multisigPda] = multisig.getMultisigPda({ createKey: createKey.publicKey });
//   try {
//     const signature = await multisig.rpc.multisigCreate({
//       connection,
//       // One-time random Key
//       createKey,
//       // The creator & fee payer
//       creator,
//       // The PDA of the multisig you are creating, derived by a random PublicKey
//       multisigPda,
//       // Here the config authority will be the system program
//       configAuthority: primary.publicKey,
//       // Create without any time-lock
//       threshold: 2,
//       // List of the members to add to the multisig
//       members: [
//         {
//           // Members Public Key
//           key: primary.publicKey,
//           // Members permissions inside the multisig
//           permissions: Permissions.all(),
//         },
//         {
//           // Members Public Key
//           key: secondary.publicKey,
//           // Members permissions inside the multisig
//           permissions: Permissions.all(),
//         },
//         {
//           // Members Public Key
//           key: advisor.publicKey,
//           // Protocols key to store data
//           permissions: Permissions.fromPermissions([Permission.Vote]),
//         }
//       ],
//       // This means that there need to be 2 votes for a transaction proposal to be approved
//       timeLock: 0,
//     });
//     return {
//         multisig: multisigPda.toBase58(),
//         keypairs: [ primary, secondary, advisor ],
//         signature: signature
//     }
//   } catch (error) {
//     console.error("Error creating multisig:", error);
//   }
// }
// // Call the async function to create the multisig and print the signature
