declare function encryptDerive(inputString: any, ivString: any, textToEncrypt: any): string;
declare function decryptDerive(inputString: any, ivString: any, encryptedText: any): string;
export { encryptDerive, decryptDerive };
