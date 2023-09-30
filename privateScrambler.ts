//this is the private scrambler that will be built using light's private solana programs
import crypto from 'crypto'


 export function deterministicScrambler(value1:any, value2:any) {
      // Concatenate the two values
    
      // Create a secret key for HMAC based on the randomString
      const secretKey = crypto.createHash('sha256').update(value1).digest();
    
      // Calculate the HMAC of the combined value using the secret key
      const hmac = crypto.createHmac('sha256', secretKey);
      hmac.update(value2.toString());
    
      // The scrambled result will be the hexadecimal representation of the HMAC
      const scrambledResult = hmac.digest('hex');
    
      return scrambledResult;
    }
    
    // Example usage:
    const value1 = '0378390e4d2ec4cd0283423d1c403b2577659bd6637386d42e86267d5b392c2d';
    const value2 = '5LUGQ6f=h=fZxhpn';
    
    // const scrambledResult = deterministicScrambler(value1, value2);
    // console.log('Scrambled Result:', scrambledResult);
    