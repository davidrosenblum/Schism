export class TokenGenerator{
    private static readonly tokenVals:string[] = "abcdefghijklmnopqrstuvxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    private _tokenLength:number;
    private _usedTokens:Map<string, boolean>;

    constructor(tokenLength:number){
        this._tokenLength = tokenLength;
        this._usedTokens = new Map();
    }

    public static anyValue():string{
        const index:number = Math.floor(Math.random() * this.tokenVals.length);
        return this.tokenVals[index];
    }

    public static anyToken(length:number):string{
        const buf:string[] = new Array(length);

        for(let i:number = 0; i < length; i++){
            buf[i] = this.anyValue();
        }

        return buf.join("");
    }

    public nextToken():string{
        let token:string;

        do{
            token = TokenGenerator.anyToken(this.tokenLength);
        } while(this.hasToken(token));

        this._usedTokens.set(token, true);
        return token;
    }

    public releaseToken(token:string):boolean{
        return this._usedTokens.delete(token);
    }

    public hasToken(token:string):boolean{
        return this._usedTokens.has(token);
    }

    public get tokenLength():number{
        return this._tokenLength;
    }
}