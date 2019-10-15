// POSSIBLE REPLACEMENT FOR UGLY UNIT INHERITANCE CHAIN

export interface UnitParams{
    x?:number;
    y?:number;
    width?:number;
    height?:number;
    type:string;
    name:string;
    ownerId?:string;
    facing?:string;
    moveSpeed?:number;
    level?:number;
};

export interface UnitState{
    id:string;
    x:number;
    y:number;
    width:number;
    height:number;
    type:string;
    name:string;
    ownerId:string;
    facing:string;
    moveSpeed:number;
    level:number;
}

export const createUnit = function(params:UnitParams){
    let unit:UnitState = {
        id:         null,
        x:          params.x || 0,
        y:          params.y || 0,
        width:      params.width || 1,
        height:     params.height || 1,
        type:       params.type,
        name:       params.name,
        ownerId:    params.ownerId || "server",
        facing:     params.facing || "right",
        moveSpeed:  params.moveSpeed || 1,
        level:      params.level || 1
    };

    return Object.assign(
        unit,
        moveable(unit),
        resizable(unit)
    );
};

const moveable = (state:{x:number, y:number}) => ({
    setPosition(x:number, y:number){
        state.x = x;
        state.y = y;
    }
});

const resizable = (state:{width:number, height:number}) => ({
    setSize(width:number, height:number){
        state.width = width;
        state.height = height;
    }
});