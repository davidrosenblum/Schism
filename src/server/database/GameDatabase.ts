import { MongoClient, Db } from "mongodb";
import { DBAccounts } from "./DBAccounts";
import { DBPlayers } from "./DBPlayers";

export class GameDatabase{
    public static instance:GameDatabase = null;

    private _client:MongoClient;
    private _database:Db;

    constructor(mongoClient:MongoClient){
        this._client = mongoClient;
        this._database = mongoClient.db(); // name in connection uri
    }

    public createCollections():Promise<{}[]>{
        return Promise.all([
            DBAccounts.createAccountsCollection(),
            DBAccounts.createSaltsCollection(),
            DBPlayers.createPlayerCollection()
        ]);
    }

    public get mongoClient():MongoClient{
        return this._client;
    }

    public get db():Db{
        return this._database;
    }
}