import { Facing, Anim } from "./GameObject";
import { NPC, NpcRank, NpcRange } from "./NPC";
import { AbilityType } from "../abilities/Ability";
import { randomElement } from "../utils/RNG";

export type NpcFaction = "Undead";

export type NpcType = (
    "ghoul" | "grave_knight" | "lich"
);

// optional parameters 
interface CreateOptions{
    name?:string;
    anim?:Anim;
    facing?:Facing;
    ownerId?:string;
    level?:number;
}

// npc parameters, missing properties found in CreateOptions (or defaults used)
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
    abilities?:Iterable<AbilityType>
}

// all npc types
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
            abilities:  ["ghoul1"]
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
            abilities:  ["graveknight1"]
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
            abilities:  ["lich1", "lich2"]
        } as PartialNpcParams
    ],
]);

// organized factions map (faction = [types])
const npcFactions:Map<NpcFaction, NpcType[]> = new Map([
    [
        "Undead", 
        ["ghoul", null, "grave_knight", "lich"]
    ]
]);

export class NPCFactory{
    /**
     * Creates a new NPC based off the enumerated type and options
     * @param type      enumerated NPC type
     * @param options   options for the NPC (overrides some defaults)
     * @returns new NPC object
     * @returns the constructed NPC
     */
    public static create(type:NpcType, options:CreateOptions={}):NPC{
        // invald type?
        if(!npcTypes.has(type))
            return null;

        const {
            ownerId="server", level=1, anim="idle"
        } = options

        // NPC params missing the values provided by options
        const params:PartialNpcParams = npcTypes.get(type);

        // remove bad options
        for(let opt in options)
            if(typeof options[opt] === "undefined")
                delete options[opt];

        // create the NPC and splice together the constructor parameters
        return new NPC({
            ...params, ...options, ownerId, level, anim
        });
    }

    /**
     * Creates a new NPC based off the faction data and options
     * @param faction   enumerated faction type
     * @param index     NPC index within the faction array
     * @param options   options for the NPC (overrides some defaults)
     * @returns the constructed NPC 
     */
    public static createFromFaction(faction:NpcFaction, index?:number, options:CreateOptions={}):NPC{
        // invaid faction?
        if(!npcFactions.has(faction))
            return null;

        // get npc types related to that faction
        const types:NpcType[] = npcFactions.get(faction);

        // index, if provided, must exist within the faction array
        if(typeof index === "number" && index in types === false)
            return null;

        // get the npc type from the provided index, or pick a random npc type if no index is provided
        const type:NpcType = (typeof index === "number") ? types[index] : <NpcType>randomElement(types);

        // create the npc from the selected type
        return this.create(type, options);
    }
}