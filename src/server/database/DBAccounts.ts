import { createHash, randomBytes } from "crypto";
import { Timestamp } from "mongodb";
import { GameDatabase } from "./GameDatabase";

export interface AccountSchema{
    username:string;
    password:string;
    accessLevel:number;
    enabled:boolean;
    dateCreated:Timestamp;
}

export interface SaltSchema{
    accountId:string;
    salt:string;
}

const md5Hash = (input:string):string => {
    return createHash("md5").update(input).digest("hex");
};

export const insertAccount = (username:string, password:string):Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        const salt:string = randomBytes(8).toString("hex");
        const pwHash:string = md5Hash(password + salt);

        const accountDoc:AccountSchema = {
            username, password: pwHash, accessLevel: 1, enabled: true, dateCreated: Timestamp.fromInt(Date.now())
        };

        db.collection<AccountSchema>("accounts").insertOne(accountDoc, (err, doc) => {
            if(err){
                reject(err);
                return;
            }

            const accountId:string = doc.insertedId.toHexString();
            const saltDoc:SaltSchema = {accountId, salt};

            db.collection<SaltSchema>("salts").insertOne(saltDoc, err => {
                err ? reject(err) : resolve();
            });
        });
    });

};

export const findAccount = (username:string, password:string):Promise<AccountSchema> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        db.collection<AccountSchema>("accounts").findOne({username}, (err, accountDoc) => {
            if(err){
                reject(err);
                return;
            }

            if(!accountDoc){
                reject(new Error("Wrong username or password."));
                return;
            }

            const accountId:string = (accountDoc as any)._id.toString("hex");
            
            db.collection<SaltSchema>("salts").findOne({accountId}, (err, saltDoc) => {
                if(err){
                    reject(err);
                    return;
                }

                if(!saltDoc){
                    console.log(`ERR: salt document missing for accountId=${accountId}.`);
                    reject(new Error("Server error."));
                    return;
                }

                const pwHash:string = md5Hash(password + saltDoc.salt);

                (pwHash === accountDoc.password) ? resolve(accountDoc) : reject(new Error("Wrong username or password."));
            });
        });
    });
};

export const createAccountsCollection = ():Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        db.createCollection("accounts", (err, col) => {
            if(err){
                reject(err);
                return;
            }

            col.createIndex("username", {unique: true}, err => {
                err ? reject(err) : resolve();
            });
        });
    });
};

export const createSaltsCollection = ():Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        db.createCollection("salts", err => {
            err ? reject(err) : resolve();
        });
    });
};

export const DBAccounts = {
    insertAccount, findAccount, createAccountsCollection, createSaltsCollection
};