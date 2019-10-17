import { MongoClient, Db } from "mongodb";
import { DBAccounts } from "./DBAccounts";
import { DBPlayers } from "./DBPlayers";

export class GameDatabase{
    /**
     * Game database singleton
     */
    public static instance:GameDatabase = null;

    private _client:MongoClient;
    private _database:Db;

    /**
     * Constructs the game database object
     * @param mongoClient mongo database client connection object
     */
    constructor(mongoClient:MongoClient){
        this._client = mongoClient;
        this._database = mongoClient.db();  // db name in connection uri
    }

    /**
     * Creates the collections in the database
     * @returns promise for all collections 
     */
    public createCollections():Promise<{}[]>{
        return Promise.all([
            DBAccounts.createAccountsCollection(),
            DBAccounts.createSaltsCollection(),
            DBPlayers.createPlayerCollection()
        ]);
    }

    /**
     * Getter for the mongodb client
     * @returns mongodb client
     */
    public get mongoClient():MongoClient{
        return this._client;
    }

    /**
     * Getter for the database
     * @returns mongodb client's database object
     */
    public get db():Db{
        return this._database;
    }
}