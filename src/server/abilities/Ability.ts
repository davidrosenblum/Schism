import { Unit } from "../entities/Unit";

export enum AbilityTargets{
    SELF_ONLY, ALLIES_ONLY, ALLIES_AND_SELF, 
    ENEMIES_ONLY, ALLIES_OR_ENEMIES, ALL
}

export enum TargetRelationship{
    SELF, ALLIES, ENEMIES
}

export enum AbilityRange{
    SELF=0, NEAR=1, FAR=2, VERY_FAR=3 
}

export interface AbilityState{
    name:string;
    internalName?:string;
    description:string;
}

export interface AbilityConfig{
    name:string;
    internalName:string;
    description:string;
    targets:AbilityTargets;
    affects:AbilityTargets;
    range:AbilityRange;
    manaCost:number;
    recharge:number;
    maxTargets:number,
    affect:(caster:Unit, target:Unit, relationship?:TargetRelationship)=>boolean;
}

export class Ability{
    private _config:AbilityConfig;
    private _ready:boolean;
    
    public onRecharge:()=>void;

    constructor(config:AbilityConfig){
        this._config = config;
        this._ready = true;
        
        this.onRecharge = null;
    }

    public affect(caster:Unit, target:Unit, relationship?:TargetRelationship):boolean{
        return this._config.affect(caster, target, relationship);
    }

    public cast(caster:Unit, mainTarget:Unit, allUnits:Iterable<Unit>, cb?:(err?:string)=>void):void{
        this.validateCast(caster, mainTarget, err => {
            if(!err){
                this._ready = false;
                caster.lookAt(mainTarget);
                caster.mana.modify(-this.manaCost);
                this.beginCast(caster, mainTarget, allUnits);
                setTimeout(() => this.forceRecharge(), this.recharge * 1000);

                if(cb) cb();
            }
            else{
                if(cb) cb(err);
            }
        });
    }

    private beginCast(caster:Unit, mainTarget:Unit, allUnits:Iterable<Unit>):void{
        let toGo:number = this.maxTargets - 1;
        let relationship:TargetRelationship = this.relationship(caster, mainTarget);

        if(!this.affect(caster, mainTarget, relationship) || toGo === 0){
            return;
        }

        for(let unit of allUnits){
            if(unit !== mainTarget && this.validateTarget(caster, unit, false)){
                relationship = this.relationship(caster, unit);
                this.affect(caster, unit, relationship);
            }

            if(--toGo === 0)
                break;
        }
    }

    public forceRecharge():void{
        this._ready = true;
        if(this.onRecharge)
            this.onRecharge();
    }

    private validateCast(caster:Unit, target:Unit, cb?:(err?:string)=>void):void{
        if(!this.isReady){
            if(cb) cb("Ability still recharging.");
            return;
        }

        if(caster.mana.current < this.manaCost){ 
            if(cb) cb("Not enough mana.");
            return;
        }

        if(!this.validateTarget(caster, target, true)){
            if(cb) cb("Invalid target.");
            return;
        }

        if(this.targets !== AbilityTargets.SELF_ONLY && !caster.inRange(target, this.getRangeDistance())){
            if(cb) cb("Target not in range.");
            return;
        }

        if(cb) cb();
    }

    private validateTarget(caster:Unit, target:Unit, primaryTarget:boolean):boolean{
        const type:AbilityTargets = primaryTarget ? this.targets : this.affects;
        switch(type){
            case AbilityTargets.ALL:
                return true;

            case AbilityTargets.SELF_ONLY:
                return caster === target;

            case AbilityTargets.ENEMIES_ONLY:
                return caster.faction !== target.faction;

            case AbilityTargets.ALLIES_ONLY:
                return caster !== target && caster.faction === target.faction;

            case AbilityTargets.ALLIES_AND_SELF:
                return caster === target || caster.faction === target.faction;

            case AbilityTargets.ALLIES_OR_ENEMIES:
                return caster !== target;
        }
    }

    private relationship(caster:Unit, target:Unit):TargetRelationship{
        if(caster === target)
            return TargetRelationship.SELF;

        if(caster.faction === target.faction)
            return TargetRelationship.ALLIES;

        else
            return TargetRelationship.ENEMIES;
    }

    public autoTarget(caster:Unit, allUnits:Iterable<Unit>):Unit{
        if(this.targets === AbilityTargets.SELF_ONLY){
            return caster;
        }

        for(let unit of allUnits){
            if(this.validateTarget(caster, unit, true)){
                return unit;
            }
        }
        return null;
    }

    public getRangeDistance():number{
        switch(this.range){
            case AbilityRange.SELF:
                return 0;

            case AbilityRange.NEAR:
                return 16;

            case AbilityRange.FAR:
                return 32;

            case AbilityRange.VERY_FAR:
                return 64;
        }

    }

    public getState():AbilityState{
        const {
            name, internalName, description
        } = this;

        return {
            name, internalName, description
        }
    }

    public get name():string{
        return this._config.name;
    }

    public get internalName():string{
        return this._config.internalName;
    }

    public get description():string{
        return this._config.description;
    }

    public get manaCost():number{
        return this._config.manaCost;
    }

    public get affects():AbilityTargets{
        return this._config.affects;
    }

    public get targets():AbilityTargets{
        return this._config.targets;
    }

    public get range():AbilityRange{
        return this._config.range;
    }

    public get maxTargets():number{
        return this._config.maxTargets;
    }

    public get recharge():number{
        return this._config.recharge;
    }

    public get isReady():boolean{
        return this._ready;
    }
}