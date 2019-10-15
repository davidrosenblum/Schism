export interface PlayerListItem{
    name:string;
    level:number;
    archetype:number;
};

export interface MapListItem{
    id:string;
    type:string;
    customName:string;
    hasPassword:boolean;
    difficulty:number;
    population:number;
    populationLimit:number;
}

export interface MapJoinData{
    id:string;
    tileLayout:number[][][];
    player:UnitState;
    units:UnitState[];
    objects:{id:string, type:string, x:number, y:number, width:number, height:number}[];
}

export interface AbilityState{
    name:string;
    internalName:string;
    description:string;
}

export interface UnitState{
    id:string;
    name:string;
    type:string;
    faction:string;
    level:number;
    health:number;
    healthCap:number;
    mana:number;
    manaCap:number;
    resistance:number;
    defense:number;
    facing:string;
    moveSpeed:number;
    anim:string;
    x?:number;
    y?:number;
    width:number;
    height:number;
    xp?:number;
    xpRequired?:number;
    archetype?:number;
    rank?:number;
    abilities:AbilityState[];
}

export interface MapFxData{
    id:string;
    type:string;
    x:number;
    y:number;
    width:number;
    height:number;
    duration:number;
};