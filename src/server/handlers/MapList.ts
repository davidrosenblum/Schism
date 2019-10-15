import { Request, Response } from "express";
import { MapsController } from "../controllers/MapsController";
import { MapSummary } from "../maps/MapInstance";
import { stringifyJson } from "../utils/JsonUtils";

export const get = (req:Request, res:Response):void => {
    const list:MapSummary[] = MapsController.getMapList();

    stringifyJson({list}, (err, json) => {
        if(err){
            res.status(500).end("Server error.");
        }
        else{
            res.contentType("application/json");
            res.status(200).end(json);
        }
    }, true);
};

export const MapList = {get};