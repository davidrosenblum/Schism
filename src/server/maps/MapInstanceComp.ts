// OBJECT COMPOSITION OF MapInstance (WIP)
import { Unit } from "../entities/Unit";
import { User } from "../users/User";

export type MapTileLayer = number[][];
export type MapTileLayout = [MapTileLayer, MapTileLayer, MapTileLayer, MapTileLayer];

export enum MapDifficulty{
    TRAINING=1, STANDARD=2, VETERAN=3, ELITE=4, SUICIDAL=5
}

// the actual map instance interface
export interface MapInstance{
    id:string;
    type:string;
    customName:string;
    hasPassword:boolean;
    population:number;
    populationLimit:number;
}

// internal state of a map instance object
export interface MapInstanceState{
    id:string;
    users:Map<string, User>;
    units:Map<string, Unit>;
    type:string;
    customName:string;
    password:string;
    difficulty:MapDifficulty;
    populationLimit:number;
}

// "constructor" parameters
export interface MapInstanceParams{
    type:string;
    customName:string;
    password?:string;
    difficulty?:MapDifficulty;
    populationLimit?:number;
}

export const createMapInstance = (params:MapInstanceParams):MapInstance => {
    const {
        type, customName, password, difficulty, populationLimit
    } = params;

    let state:MapInstanceState = {
        id: null,
        users: new Map(),
        units: new Map(),
        type,
        customName,
        password: password || "",
        difficulty: difficulty || MapDifficulty.TRAINING,
        populationLimit: populationLimit || 4
    };

    return Object.assign(
        state,
        userManager(state),
        unitManager
    );
};

const userManager = (state:{users:Map<string, User>, populationLimit:number, password:string}) => ({
    addUser(user:User, password:string="", cb?:(err?:string)=>void){
        if(this.isFull){
            if(cb) cb(`Map is at capacity.`);
            return;
        }

        if(state.password && state.password !== password){
            if(cb) cb(`Wrong password.`);
            return;
        }

        if(this.hasUser(user.id)){
            if(cb) cb(`Already in map.`);
            return;
        }

        state.users.set(user.id, user);
        
        if(cb) cb();
    },

    removeUser(user:User, cb?:(err?:string)=>void){

    },

    hasUser(user:User){
        return state.users.has(user.id);
    },

    get isEmpty(){
        return this.population === 0;
    },

    get isFull(){
        return this.population >= state.populationLimit;
    },

    get hasPassword(){
        return state.password && state.password.length > 0;
    },

    get population(){
        return state.users.size;
    }
});

const unitManager = () => {

};