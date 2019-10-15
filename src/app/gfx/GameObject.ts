import { AnimatedSprite, AnimatedSpriteParams } from "./AnimatedSprite";
import { Box } from "./Box";
import { CollisionGrid } from "./CollisionGrid";
import { Object2D } from "./Object2D";
import { Scroller } from "./Scroller";

export type Facing = "up" | "down" | "left" | "right";

export interface GameObjectParams extends AnimatedSpriteParams{
    facing?:Facing;
    moveSpeed?:number;
}

export class GameObject extends AnimatedSprite{
    private _moveSpeed:number;

    public facing:Facing;

    constructor(params:GameObjectParams){
        super(params);

        const {
            moveSpeed=1, facing="right"
        } = params;

        this._moveSpeed =   moveSpeed;
        this.facing =       facing;
    }

    public moveUp(grid?:CollisionGrid, bounds?:Box, scroller?:Scroller):Object2D{
        this.facing = "up";
        const oldY:number = this.drawBox.y;
        this.drawBox.y -= this.moveSpeed;

        if(grid){
            const hit:Object2D = this.gridHitboxTest(grid);
            if(hit){
                this.drawBox.y = oldY;
                return hit;
            }
        }

        if(bounds && this.drawBox.y < bounds.y){
            this.drawBox.y = bounds.y;
        }

        if(scroller){
            scroller.smartScrollUp(this.drawBox.centerY, Math.abs(oldY - this.drawBox.y));
        }

        return null;
    }

    public moveDown(grid?:CollisionGrid, bounds?:Box, scroller?:Scroller):Object2D{
        this.facing = "down";
        const oldY:number = this.drawBox.y;
        this.drawBox.y += this.moveSpeed;

        if(grid){
            const hit:Object2D = this.gridHitboxTest(grid);
            if(hit){
                this.drawBox.y = oldY;
                return hit;
            }
        }

        if(bounds && this.drawBox.bottom > bounds.bottom){
            this.drawBox.y = bounds.bottom - this.drawBox.height;
        }

        if(scroller){
            scroller.smartScrollDown(this.drawBox.centerY, Math.abs(oldY - this.drawBox.y));
        }

        return null;
    }

    public moveLeft(grid?:CollisionGrid, bounds?:Box, scroller?:Scroller):Object2D{
        this.facing = "left";
        const oldX:number = this.drawBox.x;
        this.drawBox.x -= this.moveSpeed;

        if(grid){
            const hit:Object2D = this.gridHitboxTest(grid);
            if(hit){
                this.drawBox.x = oldX;
                return hit;
            }
        }

        if(bounds && this.drawBox.x < bounds.x){
            this.drawBox.x = bounds.x;
        }

        if(scroller){
            scroller.smartScrollLeft(this.drawBox.centerX, Math.abs(oldX - this.drawBox.x));
        }

        return null;
    }

    public moveRight(grid?:CollisionGrid, bounds?:Box, scroller?:Scroller):Object2D{
        this.facing = "right";
        const oldX:number = this.drawBox.x;
        this.drawBox.x += this.moveSpeed;

        if(grid){
            const hit:Object2D = this.gridHitboxTest(grid);
            if(hit){
                this.drawBox.x = oldX;
                return hit;
            }
        }

        if(bounds && this.drawBox.right > bounds.right){
            this.drawBox.x = bounds.right - this.drawBox.width;
        }

        if(scroller){
            scroller.smartScrollRight(this.drawBox.centerX, Math.abs(oldX - this.drawBox.x));
        }

        return null;
    }

    private gridHitboxTest(grid:CollisionGrid):Object2D{
        return grid.getAdjacentTo(this).find(obj => obj && obj.hitBox.hitboxTest(this.hitBox));
    }

    public set moveSpeed(val:number){
        this._moveSpeed = Math.abs(val);
    }

    public get moveSpeed():number{
        return this._moveSpeed;
    }
}