export declare function encrypt(PIN: number, privateKey: any): {
    userNonce: string;
    protocolNonce: string;
    PIN: number;
    value: string;
};
