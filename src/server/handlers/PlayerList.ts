import { Request, Response } from "express";
import { DBPlayers } from "../database/DBPlayers";
import { stringifyJson } from "../utils/JsonUtils";

const get = (req:Request, res:Response):void => {
    const {accountId} = req.params;

    DBPlayers.findPlayerList(accountId)
        .then(list => {
            res.status(200);
            res.contentType("application/json");
            
            stringifyJson({list}, (err, json) => {
                if(err){
                    // bad json
                    res.status(500).end("Server error.");
                }
                else{
                    res.contentType("application/json");
                    res.status(200).end(json);
                }
            }, true);
        })
        .catch(err => {
            // if error is mongodb error - 500
            res.status(400).end("Bad account id.");
        });
};

export const PlayerList = {get};