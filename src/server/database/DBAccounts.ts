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

/**
 * Creates a md5 hash of the given input string
 * @param input value to hash
 * @returns the md5 hash string
 */
const md5Hash = (input:string):string => {
    return createHash("md5").update(input).digest("hex");
};

/**
 * Creates a new account in the database
 * @param username  new account name
 * @param password  new account password
 */
export const insertAccount = (username:string, password:string):Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // generate random salt
        const salt:string = randomBytes(8).toString("hex");
        // hash the password
        const pwHash:string = md5Hash(password + salt);

        // create the account document
        const accountDoc:AccountSchema = {
            username,
            password:       pwHash,
            accessLevel:    1,
            enabled:        true,
            dateCreated:    Timestamp.fromInt(Date.now())
        };

        // insert the account document into the database
        db.collection<AccountSchema>("accounts").insertOne(accountDoc, (err, doc) => {
            // error
            if(err){
                reject(err);
                return;
            }

            // get database-generated accountId
            const accountId:string = doc.insertedId.toHexString();
            
            // create salt document
            const saltDoc:SaltSchema = {
                accountId,
                salt
            };

            // insert salt into the database
            db.collection<SaltSchema>("salts").insertOne(saltDoc, err => {
                err ? reject(err) : resolve();
            });
        });
    });

};

/**
 * Selects a specific account from the database
 * @param username  account username
 * @param password  account password
 * @returns find account promise
 */
export const findAccount = (username:string, password:string):Promise<AccountSchema> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // find the account by username
        db.collection<AccountSchema>("accounts").findOne({username}, (err, accountDoc) => {
            // error
            if(err){
                reject(err);
                return;
            }

            // no result (wrong username)
            if(!accountDoc){
                reject(new Error("Wrong username or password."));
                return;
            }

            // get accountId from the results document (typescript unaware, thus the 'any' cast)
            const accountId:string = (accountDoc as any)._id.toString("hex");
            
            // find the account salt
            db.collection<SaltSchema>("salts").findOne({accountId}, (err, saltDoc) => {
                // error
                if(err){
                    reject(err);
                    return;
                }

                // no salt document (shouldn't happen)
                if(!saltDoc){
                    console.log(`ERR: salt document missing for accountId=${accountId}.`);
                    reject(new Error("Server error."));
                    return;
                }

                // hash the input password (as the correct password stored is a hash)
                const pwHash:string = md5Hash(password + saltDoc.salt);

                // verify hashed input password is equal to stored password hash
                (pwHash === accountDoc.password) ? resolve(accountDoc) : reject(new Error("Wrong username or password."));
            });
        });
    });
};

/**
 * Creates the accounts collection
 * @returns create collection promise
 */
export const createAccountsCollection = ():Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // create the accounts collection
        db.createCollection("accounts", (err, col) => {
            if(err){
                // error
                reject(err);
                return;
            }

            // create username index
            col.createIndex("username", {unique: true}, err => {
                err ? reject(err) : resolve();
            });
        });
    });
};

/**
 * Creates the salt collection
 * @returns create collection promise
 */
export const createSaltsCollection = ():Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // create the salts collection
        db.createCollection("salts", err => {
            err ? reject(err) : resolve();
        });
    });
};

// export functions in a single object
export const DBAccounts = {
    insertAccount, findAccount, createAccountsCollection, createSaltsCollection
};