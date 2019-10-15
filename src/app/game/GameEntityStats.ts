export interface GameEntityStatsState{
    health:number;
    healthCap:number;
    mana:number;
    manaCap:number;
    resistance:number;
    defense:number;
    name:string;
    level:number;
    faction:string;
    xp?:number;
    xpRequired?:number;
    archetype?:number;
    rank?:number;
}

export interface GameEntityStatsUpdate{
    health?:number;
    healthCap?:number;
    mana?:number;
    manaCap?:number;
    resistance?:number;
    defense?:number;
    name?:string;
    level?:number;
    faction?:string;
    xp?:number;
    xpRequired?:number;
    archetype?:number;
    rank?:number;
}

export class GameEntityStats{
    private _health:number;
    private _healthCap:number;
    private _mana:number;
    private _manaCap:number;
    private _resistance:number;
    private _defense:number;
    private _name:string;
    private _level:number;
    private _faction:string;
    private _xp:number;
    private _xpRequired:number;
    private _archetype:number;
    private _rank:number;

    constructor(params:GameEntityStatsUpdate){
        const {
            health=0, healthCap=0, mana=0, manaCap=0,
            resistance=0, defense=0, xp=0, xpRequired=0,
            name="", level=0, faction="", archetype=0,
            rank=1
        } = params;

        this._name = name;
        this._level = level;
        this._faction = faction;
        this._health = health,
        this._healthCap = healthCap
        this._mana = mana;
        this._manaCap = manaCap;
        this._resistance = resistance;
        this._defense = defense;
        this._xp  = xp;
        this._xpRequired = xpRequired;
        this._archetype = archetype;
        this._rank = rank;
    }

    public setState(update:GameEntityStatsUpdate):void{
        if(typeof update.name === "string")
            this._name = update.name;

        if(typeof update.level === "number")
            this._level = update.level;

        if(typeof update.faction === "string")
            this._faction = update.faction;

        if(typeof update.health === "number")
            this._health = update.health;

        if(typeof update.healthCap === "number")
            this._healthCap = update.healthCap;

        if(typeof update.mana === "number")
            this._mana = update.mana;

        if(typeof update.manaCap === "number")
            this._manaCap = update.manaCap;

        if(typeof update.resistance === "number")
            this._resistance = update.resistance;

        if(typeof update.defense === "number")
            this._defense = update.defense;

        if(typeof update.xp === "number")
            this._xp = update.xp;

        if(typeof update.xpRequired === "number")
            this._xpRequired = update.xpRequired;

        if(typeof update.archetype === "number")
            this._archetype = update.archetype;

        if(typeof update.rank === "number")
            this._rank = update.rank;
    }

    public getState():GameEntityStatsState{
        return {
            name: this._name,
            level: this._level,
            faction: this._faction,
            health: this._health,
            healthCap: this._healthCap,
            mana: this._mana,
            manaCap: this._manaCap,
            resistance: this._resistance,
            defense: this._defense,
            xp: this._xp,
            xpRequired: this._xpRequired,
            archetype: this._archetype,
            rank: this._rank
        };
    }
}