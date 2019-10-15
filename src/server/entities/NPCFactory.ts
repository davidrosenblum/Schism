import { NPC, NpcRank, NpcRange } from "./NPC";
import { Facing, Anim } from "./GameEntity";
import { randomIndex } from "../utils/RNG";

export type NpcFaction = "Test" | "Undead";

export type NpcType = "ghoul" | "grave_knight" | "lich"

interface CreateOptions{
    name?:string;
    anim?:Anim;
    facing?:Facing;
    ownerId?:string;
    level?:number;
}

interface PartialNpcParams{
    type:NpcType;
    rank:NpcRank;
    faction:NpcFaction;
    prefRange:NpcRange;
    health:number;
    mana:number;
    resistance:number;
    defense:number;
    name:string;
    width:number;
    height:number;
}

const npcTypes:Map<NpcType, PartialNpcParams> = new Map([
    [
        "ghoul", {
            type:       "ghoul",
            name:       "Ghoul",
            faction:    "Undead",
            rank:       NpcRank.MINION,
            prefRange:  NpcRange.MELEE,
            health:     50,
            mana:       100,
            resistance: 0.00,
            defense:    0.00,
            width:      48,
            height:     83,
        } as PartialNpcParams
    ],
    [
        "grave_knight", {
            type:       "grave_knight",
            name:       "Grave Knight",
            faction:    "Undead",
            rank:       NpcRank.ELITE,
            prefRange:  NpcRange.MELEE,
            health:     90,
            mana:       100,
            resistance: 0.20,
            defense:    0.05,
            width:      64,
            height:     110,
        } as PartialNpcParams
    ],
    [
        "lich", {
            type:       "lich",
            name:       "Lich",
            faction:    "Undead",
            rank:       NpcRank.ELITE,
            prefRange:  NpcRange.RANGED,
            health:     75,
            mana:       100,
            resistance: 0.10,
            defense:    0.15,
            width:      64,
            height:     135,
        } as PartialNpcParams
    ],
]);

const npcFactions:Map<NpcFaction, NpcType[]> = new Map([
    [
        "Undead", 
        ["ghoul", "grave_knight", "lich"]
    ]
]);

export class NPCFactory{
    public static create(type:NpcType, options:CreateOptions={}):NPC{
        if(!npcTypes.has(type)){
            return null;
        }

        const params:PartialNpcParams = npcTypes.get(type);

        const {
            ownerId="server", level=1, anim="idle"
        } = options;

        return new NPC({
            ...params, ...options, ownerId, level, anim
        });
    }

    public static createFromFaction(faction:NpcFaction, index?:number, options:CreateOptions={}):NPC{
        if(!npcFactions.has(faction)){
            return null;
        }

        const types:NpcType[] = npcFactions.get(faction);

        if(typeof index === "number" && index in types === false){
            return null;
        }

        const type:NpcType = (typeof index === "number") ? types[index] : randomIndex(types);

        return this.create(type, options);
    }
}