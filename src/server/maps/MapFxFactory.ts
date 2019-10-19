import { MapFxData, MapFxType } from "./MapFxData";

interface PartialMapFxParams{
    type:MapFxType;
    width:number;
    height:number;
}

const mapFxTypes:Map<MapFxType, PartialMapFxParams> = new Map([
    ["levelup", {
        type: "levelup",
        width: 64,
        height: 135,
    } as PartialMapFxParams],
    ["rez", {
        type: "rez",
        width: 64,
        height: 200,
    } as PartialMapFxParams]  
]);

export class MapFxFactory{
    /**
     * Creates a map effect with preset data.
     * @param type      Enumerated map effect type.
     * @param targetId  Target object id.
     * @returns The created map effect.
     */
    public static create(type:MapFxType, targetId:string):MapFxData{
        if(!mapFxTypes.has(type))
            return null;

        return new MapFxData({
            ...mapFxTypes.get(type),
            targetId
        });
    }
}