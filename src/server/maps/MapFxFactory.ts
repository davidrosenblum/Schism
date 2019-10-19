import { MapFxData, MapFxType } from "./MapFxData";

interface PartialMapFxParams{
    width:number;
    height:number;
    sticky:boolean;
}

const mapFxTypes:Map<MapFxType, PartialMapFxParams> = new Map([
    ["levelup", {
        width: 64,
        height: 135,
        sticky: true
    } as PartialMapFxParams],
    ["rez", {
        width: 64,
        height: 200,
        sticky: false
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
            type,
            ...mapFxTypes.get(type),
            targetId
        });
    }
}