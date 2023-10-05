import { Connection, Keypair, PublicKey } from "@solana/web3.js";
export declare function loadWalletKey(keypairFile: string): Keypair;
export declare function loadWalletKeypair(keypairFile: Array<number>): Keypair;
export type TestMembers = {
    almighty: Keypair;
    proposer: Keypair;
    voter: Keypair;
    executor: Keypair;
};
export declare function generateMultisigMembers(connection: Connection): Promise<TestMembers>;
export declare function createAutonomousMultisig({ connection, createKey, members, threshold, timeLock, }: {
    createKey?: Keypair;
    members: TestMembers;
    threshold: number;
    timeLock: number;
    connection: Connection;
}): Promise<readonly [PublicKey, number]>;
export declare function createControlledMultisig({ connection, createKey, configAuthority, members, threshold, timeLock, }: {
    createKey?: Keypair;
    configAuthority: PublicKey;
    members: TestMembers;
    threshold: number;
    timeLock: number;
    connection: Connection;
}): Promise<readonly [PublicKey, number]>;
export declare function createLocalhostConnection(): Connection;
export declare function generateFundedKeypair(connection: Connection): Promise<Keypair>;
export declare function createTestTransferInstruction(authority: PublicKey, recipient: PublicKey, amount?: number): import("@solana/web3.js").TransactionInstruction;
/** Returns true if the given unix epoch is within a couple of seconds of now. */
export declare function isCloseToNow(unixEpoch: number | bigint, timeWindow?: number): boolean;
/** Returns an array of numbers from min to max (inclusive) with the given step. */
export declare function range(min: number, max: number, step?: number): number[];
