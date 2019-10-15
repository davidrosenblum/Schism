import { AssetsManager } from "./AssetsManager";
import { GameManager, TILE_SIZE } from "./GameManager";
import { store } from "../Client";
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
            player: this.fakePlayerData(),
            units: [
                this.fakePlayerData(),
                this.fakeLichData()
            ],
            objects: [

            ]
        }
    }

    private static fakePlayerData():any{
        return {
            id: "123",
            type: "player",
            name: "WorldEdit",
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
            x: TILE_SIZE * 2,
            y: TILE_SIZE* 3
        }
    }

    private static fakeLichData():any{
        return {
            id: "666",
            type: "lich",
            name: "Lich Dude",
            faction: "Undead",
            level: 0,
            width: 55,
            height: 100,
            health: 1,
            healthCap: 1,
            mana: 1,
            manaCap: 1,
            resistance: 0.9,
            defense: 0.5,
            moveSpeed: 1,
            facing: "right",
            anim: "idle",
            rank: 2,
            x: TILE_SIZE * 2,
            y: TILE_SIZE* 5
        }
    }
}