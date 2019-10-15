import { MapFx } from "./MapFx";
import { MapFxData } from "../data/Payloads";

const fxs:{[fxType:string]: string} = {
    "explosion": null
};

interface Params{
    id:string;
    width:number;
    height:number;
    x?:number;
    y?:number
}

export class MapFxFactory{
    public static create(type:string, params:Params):MapFx{
        if(type in fxs){
            return new MapFx({...params, imageSrc: fxs[type]});
        }
        return null;
    }
}