import * as React from "react";
import { TILE_SIZE, GROUND_OFFSET } from "../game/GameManager";
import { MapTileFactory } from "../game/MapTileFactory";
import { Box } from "../gfx/Box";
import { MapLoader } from "../gfx/MapLoader";
import { Object2DContainer } from "../gfx/Object2DContainer";
import { Keyboard } from "../gfx/Keyboard";
import { Renderer } from "../gfx/Renderer";
import { Scroller } from "../gfx/Scroller";

const MAP_LAYERS:number = 2;
const MAP_ROWS:number = 15;
const MAP_COLS:number = 20;
const UNSELECTED_LAYER_ALPHA:number = 0.50;

type Matrix = number[][];

const createEmptyMatrix = (rows:number, cols:number, layer:number=0):Matrix => {
    const matrix:Matrix = new Array(rows);
    for(let r:number = 0; r < rows; r++){
        matrix[r] = new Array(cols).fill(layer === 0 ? 1 : 9);
    }
    return matrix;
};

const createMatrixes = (rows:number, cols:number):Matrix[] => {
    const matrixes:Matrix[] = [];
    for(let i:number = 0; i < MAP_LAYERS; i++){
        matrixes[i] = createEmptyMatrix(rows, cols, i);
    }
    return matrixes;
};

const createScenes = (layers:number):Object2DContainer[] => {
    const scenes:Object2DContainer[] = [];
    for(let i:number = 0; i < layers; i++){
        scenes.push(new Object2DContainer());
    }
    return scenes;
};

export const DevMapMaker = () => {
    const [matrixes, setMatrixes] = React.useState<Matrix[]>(createMatrixes(MAP_ROWS, MAP_COLS));
    const [scenes, setScenes] = React.useState<Object2DContainer[]>(createScenes(MAP_LAYERS));
    const [layer, setLayer] = React.useState<number>(0);
    const canvasRef = React.useRef();

    const onLayerSelect = (evt:React.ChangeEvent<HTMLSelectElement>) => {
        const newLayer:number = parseInt(evt.target.value);
        setLayer(newLayer);
    };

    const onTile = ({tile, id, row, col, layer}) => {
        tile.onClick = (evt) => {
            if(evt.sceneClicked === 1){
                const matrixesCopy:Matrix[] = [...matrixes];
                matrixesCopy[layer][row][col] = nextSafeId(id, layer);
                setMatrixes(matrixesCopy);
            }
        };
    };

    const nextSafeId = (id:number, layer:number):number => {
        while(!MapTileFactory.create(++id, layer)){
            if(id > 9)
                id = 0;
        }
        return id;
    };

    const beforeRender = (scroller:Scroller, keyboard:Keyboard) => {
        if(keyboard.isKeyDown("w")){
            scroller.scrollUp(1);
        }
        else if(keyboard.isKeyDown("s")){
            scroller.scrollDown(1);
        }
        if(keyboard.isKeyDown("a")){
            scroller.scrollLeft(1);
        }
        else if(keyboard.isKeyDown("d")){
            scroller.scrollRight(1);
        }
    };

    const exportJson = () => {
        const result = [];
        matrixes.forEach((matrix, i) => {
            result.push([]);
            matrix.forEach(row => result[i].push(`\t\t[${row.join(", ")}],\n`));
        });

        const elem = document.createElement("textarea");
        elem.value = "[\n" + result.map(matrix => `\t[\n${matrix.join("")}\n\t]`).join(",\n") + "\n]";
        document.body.appendChild(elem);
        elem.select();
        document.execCommand("copy");
        document.body.removeChild(elem);
    };

    const reloadLayer = () => {
        scenes[layer].removeChildren();

        MapLoader.load({
            layout:         [matrixes[layer]],
            cellSize:       TILE_SIZE,
            groundOffset:   GROUND_OFFSET,
            containers:     [scenes[layer]],
            getTile:        (id) => MapTileFactory.create(id, layer),
            onTile:         (args) => onTile({...args, layer})
        });
    };

    React.useEffect(() => {
        const keyboard = new Keyboard();
        const renderer = new Renderer(960, 540, canvasRef.current);
        const scroller = new Scroller(renderer, new Box(TILE_SIZE * MAP_COLS, TILE_SIZE * MAP_ROWS));

        renderer.beforeRender = () => beforeRender(scroller, keyboard);
        renderer.render(scenes);
        
        return () => {
            renderer.stop();
            renderer.beforeRender = null;
            keyboard.stop();
            keyboard.onKey = null;
        };
    }, []);

    React.useEffect(() => {
        reloadLayer();

        scenes.forEach((scene, i) => {
            if(i !== layer){
                scene.forEachChild(child => {
                    child.onClick = null;
                    if(i > 0)
                        child.alpha = UNSELECTED_LAYER_ALPHA;
                });
            }
        });
    }, [layer]);

    React.useEffect(() => {
        reloadLayer();
    }, [matrixes]);

    return (
        <div className="text-center">
            <div>
                <canvas style={{backgroundColor: "black"}} ref={canvasRef}/>
            </div>
            <div>
                <p>Click on a tile to change type.</p>
                <p>Up / Down arrow keys to cycle between layers.</p>
                <p>W-A-S-D keys to scroll.</p>
            </div>
            <br/>
            <div>
                <select onChange={onLayerSelect}>
                    <option value={0}>Layer 1</option>
                    <option value={1}>Layer 2</option>
                </select>
            </div>
            <br/>
            <div>
                <button onClick={exportJson}>
                    Export
                </button>
                &nbsp;
                (Copies to clipboard)
            </div>
        </div>
    )
};