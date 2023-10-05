"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = exports.isCloseToNow = exports.createTestTransferInstruction = exports.generateFundedKeypair = exports.createLocalhostConnection = exports.createControlledMultisig = exports.createAutonomousMultisig = exports.generateMultisigMembers = exports.loadWalletKeypair = exports.loadWalletKey = void 0;
const web3_js_1 = require("@solana/web3.js");
const multisig = __importStar(require("@sqds/multisig"));
const fs_1 = __importDefault(require("fs"));
const { Permission, Permissions } = multisig.types;
function loadWalletKey(keypairFile) {
    const loaded = web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs_1.default.readFileSync(keypairFile).toString())));
    return loaded;
}
exports.loadWalletKey = loadWalletKey;
function loadWalletKeypair(keypairFile) {
    const loaded = web3_js_1.Keypair.fromSecretKey(new Uint8Array(keypairFile));
    return loaded;
}
exports.loadWalletKeypair = loadWalletKeypair;
async function generateMultisigMembers(connection) {
    const members = {
        almighty: web3_js_1.Keypair.generate(),
        proposer: web3_js_1.Keypair.generate(),
        voter: web3_js_1.Keypair.generate(),
        executor: web3_js_1.Keypair.generate(),
    };
    // UNCOMMENT TO PRINT MEMBER PUBLIC KEYS
    // console.log("Members:");
    // for (const [name, keypair] of Object.entries(members)) {
    //   console.log(name, ":", keypair.publicKey.toBase58());
    // }
    // Airdrop 100 SOL to each member.
    await Promise.all(Object.values(members).map(async (member) => {
        const sig = await connection.requestAirdrop(member.publicKey, 100 * web3_js_1.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(sig);
        console.log(sig);
    }));
    return members;
}
exports.generateMultisigMembers = generateMultisigMembers;
async function createAutonomousMultisig({ connection, createKey = web3_js_1.Keypair.generate(), members, threshold, timeLock, }) {
    const creator = await generateFundedKeypair(connection);
    const [multisigPda, multisigBump] = multisig.getMultisigPda({
        createKey: createKey.publicKey,
    });
    const signature = await multisig.rpc.multisigCreate({
        connection,
        creator,
        multisigPda,
        configAuthority: null,
        timeLock,
        threshold,
        members: [
            { key: members.almighty.publicKey, permissions: Permissions.all() },
            {
                key: members.proposer.publicKey,
                permissions: Permissions.fromPermissions([Permission.Initiate]),
            },
            {
                key: members.voter.publicKey,
                permissions: Permissions.fromPermissions([Permission.Vote]),
            },
            {
                key: members.executor.publicKey,
                permissions: Permissions.fromPermissions([Permission.Execute]),
            },
        ],
        createKey: createKey,
        sendOptions: { skipPreflight: true },
    });
    await connection.confirmTransaction(signature);
    return [multisigPda, multisigBump];
}
exports.createAutonomousMultisig = createAutonomousMultisig;
async function createControlledMultisig({ connection, createKey = web3_js_1.Keypair.generate(), configAuthority, members, threshold, timeLock, }) {
    const creator = await generateFundedKeypair(connection);
    const [multisigPda, multisigBump] = multisig.getMultisigPda({
        createKey: createKey.publicKey,
    });
    const signature = await multisig.rpc.multisigCreate({
        connection,
        creator,
        multisigPda,
        configAuthority,
        timeLock,
        threshold,
        members: [
            { key: members.almighty.publicKey, permissions: Permissions.all() },
            {
                key: members.proposer.publicKey,
                permissions: Permissions.fromPermissions([Permission.Initiate]),
            },
            {
                key: members.voter.publicKey,
                permissions: Permissions.fromPermissions([Permission.Vote]),
            },
            {
                key: members.executor.publicKey,
                permissions: Permissions.fromPermissions([Permission.Execute]),
            },
        ],
        createKey: createKey,
        sendOptions: { skipPreflight: true },
    });
    await connection.confirmTransaction(signature);
    return [multisigPda, multisigBump];
}
exports.createControlledMultisig = createControlledMultisig;
function createLocalhostConnection() {
    return new web3_js_1.Connection("http://127.0.0.1:8899", "confirmed");
}
exports.createLocalhostConnection = createLocalhostConnection;
async function generateFundedKeypair(connection) {
    const keypair = web3_js_1.Keypair.generate();
    const tx = await connection.requestAirdrop(keypair.publicKey, 1 * web3_js_1.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(tx);
    return keypair;
}
exports.generateFundedKeypair = generateFundedKeypair;
function createTestTransferInstruction(authority, recipient, amount = 1000000) {
    return web3_js_1.SystemProgram.transfer({
        fromPubkey: authority,
        lamports: amount,
        toPubkey: recipient,
    });
}
exports.createTestTransferInstruction = createTestTransferInstruction;
/** Returns true if the given unix epoch is within a couple of seconds of now. */
function isCloseToNow(unixEpoch, timeWindow = 2000) {
    const timestamp = Number(unixEpoch) * 1000;
    return Math.abs(timestamp - Date.now()) < timeWindow;
}
exports.isCloseToNow = isCloseToNow;
/** Returns an array of numbers from min to max (inclusive) with the given step. */
function range(min, max, step = 1) {
    const result = [];
    for (let i = min; i <= max; i += step) {
        result.push(i);
    }
    return result;
}
exports.range = range;
