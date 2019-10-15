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

export const findPlayerList = (accountId:string):Promise<PlayerListSchema[]> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        db.collection<PlayerSchema>("players").find({accountId}).toArray()
            .then(res => {
                const list:PlayerListSchema[] = res.map(doc => {
                    const {name, level, archetype} = doc;
                    return {archetype, level, name};
                });
                resolve(list);
            })
            .catch(err => reject(err));
    });
};

export const insertPlayer = (accountId:string, name:string, archetype:number):Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        const playerDoc:PlayerSchema = {
            accountId,
            name,
            archetype,
            level: 1,
            xp: 0,
            merits: 0
        };

        db.collection<PlayerSchema>("players").insertOne(playerDoc, (err, res) => {
            err ? reject(err) : resolve();
        });
    }); 
};

export const findPlayer = (accountId:string, name:string):Promise<PlayerSchema> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        db.collection<PlayerSchema>("players").findOne({accountId, name}, (err, playerDoc) => {
            err ? reject(err) : resolve(playerDoc);
        });
    });
};

export const deletePlayer = (accountId:string, name:string):Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        db.collection<PlayerSchema>("players").deleteOne({accountId, name}, (err, res) => {
            err ? reject(err) : resolve(res.deletedCount > 0);
        });
    });
};

export const updatePlayer = (name:string, update:PlayerUpdateSchema):Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        const mongoUpdate = {
            $set: update
        };

        db.collection<PlayerSchema>("players").updateOne({name}, mongoUpdate, err => {
            err ? reject(err) : resolve();
        });
    });
}

export const createPlayerCollection = ():Promise<{}> => {
    return new Promise((resolve, reject) => {
        const {db} = GameDatabase.instance;

        db.createCollection("players", (err, col) => {
            if(err){
                reject(err);
                return;
            }

            Promise.all([
                col.createIndex("name", {unique: true}),
                col.createIndex("accountId")
            ])
            .then(() => resolve())
            .catch(err => reject(err));
        });
    });
};

export const DBPlayers = {
    findPlayerList, findPlayer, insertPlayer, deletePlayer, updatePlayer, createPlayerCollection
};