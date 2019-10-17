import { UpdateQuery } from "mongodb";
import { GameDatabase } from "./GameDatabase";

export interface PlayerSchema{
    accountId:string;
    name:string;
    archetype:number;
    level:number;
    xp:number;
    merits:number;
}

export interface PlayerUpdateSchema{
    level?:number;
    xp?:number;
    merits?:number;
}

export interface PlayerListSchema{
    name:string;
    archetype:number;
    level:number;
}

/**
 * Finds all the player summaries for an account
 * @param accountId account to find all players for
 * @returns find player summaries promise
 */
export const findPlayerList = (accountId:string):Promise<PlayerListSchema[]> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // find all players matching the account id
        db.collection<PlayerSchema>("players").find({accountId}).toArray()
            .then(res => {
                // no error, remove sensitive information from each results element
                const list:PlayerListSchema[] = res.map(doc => {
                    const {name, level, archetype} = doc;
                    return {archetype, level, name};
                });
                resolve(list);
            })
            .catch(err => reject(err));
    });
};

/**
 * Inserts a new player into the database
 * @param accountId new player's associated accountId
 * @param name      new player's name
 * @param archetype new player's archetype (id not name)
 * @returns collection insert promise
 */
export const insertPlayer = (accountId:string, name:string, archetype:number):Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // create the player document
        const playerDoc:PlayerSchema = {
            accountId,
            name,
            archetype,
            level: 1,
            xp: 0,
            merits: 0
        };

        // insert document into the database
        db.collection<PlayerSchema>("players").insertOne(playerDoc, err => {
            err ? reject(err) : resolve();
        });
    }); 
};

/**
 * Selects a player from the database
 * @param accountId player account id
 * @param name      player name
 * @returns collection find promise 
 */
export const findPlayer = (accountId:string, name:string):Promise<PlayerSchema> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // find in the database by accountId and name
        db.collection<PlayerSchema>("players").findOne({accountId, name}, (err, playerDoc) => {
            err ? reject(err) : resolve(playerDoc);
        });
    });
};

/**
 * Deletes a player from the database
 * @param accountId player account id
 * @param name      player name
 * @returns collection delete promise 
 */
export const deletePlayer = (accountId:string, name:string):Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // delete from the database... find by accountId and name
        db.collection<PlayerSchema>("players").deleteOne({accountId, name}, (err, res) => {
            err ? reject(err) : resolve(res.deletedCount > 0);
        });
    });
};

/**
 * Updates the player in the database
 * @param name      player name
 * @param update    update objece
 * @returns collection update promise 
 */
export const updatePlayer = (name:string, update:PlayerUpdateSchema):Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // update query
        const mongoUpdate:UpdateQuery<PlayerSchema> = {
            $set: update
        };

        // update the database... find by name and apply update
        db.collection<PlayerSchema>("players").updateOne({name}, mongoUpdate, err => {
            err ? reject(err) : resolve();
        });
    });
}

/**
 * Creates the player collection
 * @returns collection create promise 
 */
export const createPlayerCollection = ():Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        // create the players collection
        db.createCollection("players", (err, col) => {
            if(err){
                // error
                reject(err);
                return;
            }

            // create indexes 
            Promise.all([
                col.createIndex("name", {unique: true}),
                col.createIndex("accountId")
            ])
            .then(() => resolve())
            .catch(err => reject(err));
        });
    });
};

// export functions in an single object
export const DBPlayers = {
    findPlayerList, findPlayer, insertPlayer, deletePlayer, updatePlayer, createPlayerCollection
};