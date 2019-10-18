export class TokenGenerator{
    private static readonly tokenVals:string[] = "abcdefghijklmnopqrstuvxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    private _tokenLength:number;
    private _usedTokens:Map<string, boolean>;

    /**
     * Constructs a Token Generator object
     * @param tokenLength   characters per token
     */
    constructor(tokenLength:number){
        this._tokenLength = tokenLength;
        this._usedTokens = new Map();
    }

    /**
     * Generates a random alpha-numeric character
     * @returns random character
     */
    public static anyValue():string{
        const index:number = Math.floor(Math.random() * this.tokenVals.length);
        return this.tokenVals[index];
    }

    /**
     * Generates a random token of the given size
     * @param length    token string length
     * @returns token
     */
    public static anyToken(length:number):string{
        // prepare buffer
        const buf:string[] = new Array(length);

        // fill buffer with random values
        for(let i:number = 0; i < length; i++){
            buf[i] = this.anyValue();
        }

        // return buffer as string
        return buf.join("");
    }

    /**
     * Generates a unused token
     * @returns guid token
     */
    public nextToken():string{
        // prepare to store tokens
        let token:string;

        // keep generating tokens while they are in use
        do{
            token = TokenGenerator.anyToken(this.tokenLength);
        } while(this.hasToken(token));

        // found a good token, mark as used
        this._usedTokens.set(token, true);
        return token;
    }

    /**
     * Marks the token as available
     * @param token token to free up
     * @returns true/false if token was used and now free
     */
    public releaseToken(token:string):boolean{
        return this._usedTokens.delete(token);
    }

    /**
     * Checks if token is in use 
     * @param token token to check
     * @returns true/false token unused
     */
    public hasToken(token:string):boolean{
        return this._usedTokens.has(token);
    }

    /**
     * Getter for token length
     * @returns characters per token
     */
    public get tokenLength():number{
        return this._tokenLength;
    }
}