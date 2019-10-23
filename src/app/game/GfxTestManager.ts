import { AssetsManager } from "./AssetsManager";
import { GameManager, TILE_SIZE } from "./GameManager";
import { store } from "..";
import { setPlayerData } from "../actions/GameStatsActions";
import { showGame } from "../actions/MenuActions";
import { MapJoinData } from "../data/Payloads";
import { chatBuffer } from "../controllers/InGameController";

export class GfxTestManager{
    public static runTestMode():void{
        console.log("GFX Test Mode")
        store.dispatch(showGame());

        store.dispatch(setPlayerData(this.fakePlayerData()));

        AssetsManager.loadAssets(() => {
            GameManager.loadMap(this.fakeMapData(), document.querySelector("canvas"));
        });

        setTimeout(() => {
            chatBuffer.write("GFX TEST MODE");
            chatBuffer.write("All online features will not work!");
        }, 100);

        GameManager.clientId = "1";
    }

    private static fakeMapData():MapJoinData{
        return {
            id: "map-id-123",
            tileLayout: [
                [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [8, 8, 8, 8, 8, 8, 8, 8, 1, 1, 1, 1, 8, 8, 8, 8, 8, 8, 8, 8],
                    [8, 8, 8, 8, 8, 8, 8, 8, 1, 1, 1, 1, 8, 8, 8, 8, 8, 8, 8, 8],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1],
                    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
                    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
                    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1]
                ],
                [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9],
                    [9, 9, 9, 9, 9, 9, 9, 9, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
                    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
                ],
                []
            ],
            units: [
                this.fakePlayerData(2, 3),
                this.fakeLichData(2, 2, "idle"),
                this.fakeLichData(2, 6, "run"),
                this.fakeLichData(2, 10, "attack"),
                this.fakeGhoulData(4, 2, "idle"),
                this.fakeGhoulData(4, 6, "run"),
                this.fakeGhoulData(4, 10, "attack"),
                this.fakeGraveKnightData(6, 2, "idle"),
                this.fakeGraveKnightData(6, 6, "run"),
                this.fakeGraveKnightData(6, 10, "attack")
            ],
            objects: [

            ]
        }
    }

    private static fakePlayerData(row:number=1, col:number=1):any{
        return {
            id: "123",
            type: "player",
            name: "WorldEdit",
            faction: "Players",
            ownerId: "1",
            level: 0,
            width: 55,
            height: 100,
            health: 100,
            healthCap: 100,
            mana: 100,
            manaCap: 100,
            resistance: 0.9,
            defense: 0.5,
            xp: 0,
            xpRequired: 9999,
            archetype: 1,
            moveSpeed: 2,
            facing: "right",
            anim: "idle",
            x: TILE_SIZE * col,
            y: TILE_SIZE * row - 100
        }
    }

    private static fakeLichData(row:number=1, col:number=1, anim:string="idle"):any{
        return {
            id: (performance.now() + Math.random()).toString(),
            type: "lich",
            name: "Test Lich",
            faction: "Undead",
            level: 0,
            width: 64,
            height: 135,
            health: 1,
            healthCap: 1,
            mana: 1,
            manaCap: 1,
            resistance: 0.9,
            defense: 0.5,
            moveSpeed: 1,
            facing: "right",
            anim,
            rank: 2,
            x: TILE_SIZE * col,
            y: TILE_SIZE * row - 100
        }
    }

    private static fakeGhoulData(row:number=1, col:number=1, anim:string="idle"):any{
        return {
            id: (performance.now() + Math.random()).toString(),
            type: "ghoul",
            name: "Test Ghoul",
            faction: "Undead",
            level: 0,
            width: 48,
            height: 83,
            health: 1,
            healthCap: 1,
            mana: 1,
            manaCap: 1,
            resistance: 0.9,
            defense: 0.5,
            moveSpeed: 1,
            facing: "right",
            anim,
            rank: 1,
            x: TILE_SIZE * col,
            y: TILE_SIZE * row - 83
        }
    }

    private static fakeGraveKnightData(row:number=1, col:number=1, anim:string="idle"):any{
        return {
            id: (performance.now() + Math.random()).toString(),
            type: "grave_knight",
            name: "Test Grave Knight",
            faction: "Undead",
            level: 0,
            width: 64,
            height: 110,
            health: 1,
            healthCap: 1,
            mana: 1,
            manaCap: 1,
            resistance: 0.9,
            defense: 0.5,
            moveSpeed: 1,
            facing: "right",
            anim,
            rank: 2,
            x: TILE_SIZE * col,
            y: TILE_SIZE * row - 110
        }
    }
}