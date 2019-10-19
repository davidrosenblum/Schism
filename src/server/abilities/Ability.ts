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

export type AbilityType = (
    "knight1" | "knight2" | "knight3" | "knight4" |
    "ranger1" | "ranger2" | "ranger3" | "ranger4" |
    "alchemist1" | "alchemist2" | "alchemist3" | "alchemist4" |
    "ghoul1" | "graveknight1" | "lich1" | "lich2"
);

export interface AbilityState{
    name:string;
    internalName:AbilityType;
    description:string;
}

export interface AbilityConfig{
    name:string;
    internalName:AbilityType;
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
    public static readonly CAST_DURATION:number = 2 * 1000;

    private _config:AbilityConfig;
    private _ready:boolean;
    
    public onRecharge:()=>void;

    /**
     * Createst an ability object that wraps the ability configuration
     * @param config ability configuration
     */
    constructor(config:AbilityConfig){
        this._config = config;  // wrap the ability config
        this._ready = true;     // ready to cast initially
        
        this.onRecharge = null; // no recharge listener by default
    }

    /**
     * Affects a target 
     * @param caster        unit casting the ability
     * @param target        unit being affected by the ability
     * @param relationship  relationship between caster and target
     * @returns true/false if ability was successful (not dodged)
     */
    public affect(caster:Unit, target:Unit, relationship:TargetRelationship):boolean{
        return this._config.affect(caster, target, relationship);
    }

    /**
     * Casts the ability, if valid
     * @param caster        unit casting the ability
     * @param mainTarget    first unit being affected by the ability
     * @param allUnits      all possible targets
     * @param cb            callback for helpful errors (with validation)
     */
    public cast(caster:Unit, mainTarget:Unit, allUnits:Iterable<Unit>, cb?:(err?:string)=>void):void{
        this.validateCast(caster, mainTarget, err => {
            if(!err){
                // valid cast
                this._ready = false;                                                // ability no longer ready
                caster.lookAt(mainTarget);                                          // caster looks at target
                caster.anim = "attack";                                             // attack animation
                caster.mana.modify(-this.manaCost);                                 // consume mana
                this.affectTargets(caster, mainTarget, allUnits);                   // start affecting targets
                setTimeout(() => this.forceRecharge(), this.recharge * 1000);       // begin cooldown

                // reset animation when cast complete
                setTimeout(() => {
                    if(caster.anim === "attack")
                        caster.anim = "idle";
                }, Ability.CAST_DURATION);

                if(cb) cb();
            }
            else{
                // invalid cast
                if(cb) cb(err);
            }
        });
    }

    /**
     * 
     * @param caster        unit casting the ability
     * @param mainTarget    first unit being affected by the ability
     * @param allUnits      all possible targets
     */
    private affectTargets(caster:Unit, mainTarget:Unit, allUnits:Iterable<Unit>):void{
        // units remaining that can be affected (-1 to include first target)
        let toGo:number = this.maxTargets - 1;
        // relationship between caster and first target (later between caster and current target)
        let relationship:TargetRelationship = this.relationship(caster, mainTarget);

        // bail out if the ability missed or only affects 1 target
        if(!this.affect(caster, mainTarget, relationship) || toGo === 0)
            return;

        // attempt to affect subsequent targets
        for(let unit of allUnits){
            // affect targets if not primary target (already affected) and are valid
            if(unit !== mainTarget && this.validateTarget(caster, unit, false)){
                relationship = this.relationship(caster, unit);
                this.affect(caster, unit, relationship);
            }

            // maximum targets affected reached
            if(--toGo === 0)
                break;
        }
    }

    /**
     * Forces the ability to be recharged
     */
    public forceRecharge():void{
        this._ready = true;
        if(this.onRecharge)
            this.onRecharge();
    }

    /**
     * Determines if the ability is ready to be casted
     * @param caster    unit casting the ability
     * @param target    initial target
     * @param cb        callback for helpful error
     */
    private validateCast(caster:Unit, target:Unit, cb?:(err?:string)=>void):void{
        // ability must be ready (not recharging)
        if(!this.isReady){
            if(cb) cb("Ability still recharging.");
            return;
        }

        // caster must have enough mana
        if(caster.mana.current < this.manaCost){ 
            if(cb) cb("Not enough mana.");
            return;
        }

        // initial target must be valid
        if(!this.validateTarget(caster, target, true)){
            if(cb) cb("Invalid target.");
            return;
        }

        // target must be in range (or self because that's always in range)
        if(this.targets !== AbilityTargets.SELF_ONLY && !caster.inRange(target, this.getRangeDistance())){
            if(cb) cb("Target not in range.");
            return;
        }

        // good to go
        if(cb) cb();
    }

    /**
     * Determines if a target is valid or not
     * @param caster        unit casting the ability
     * @param target        unit possible being affected
     * @param primaryTarget true = first target, false = subsequent
     */
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

    /**
     * Figures out the relationship between the caster and target
     * @param caster    unit casting the ability
     * @param target    unit affected by the ability
     * @returns the enumerated relationship type
     */
    private relationship(caster:Unit, target:Unit):TargetRelationship{
        if(caster === target)
            return TargetRelationship.SELF;

        if(caster.faction === target.faction)
            return TargetRelationship.ALLIES;

        else
            return TargetRelationship.ENEMIES;
    }

    /**
     * Finds the first possible target
     * @param caster    unit casting the ability
     * @param allUnits  all potential targets
     * @returns the first valid target
     */
    public autoTarget(caster:Unit, allUnits:Iterable<Unit>):Unit{
        if(this.targets === AbilityTargets.SELF_ONLY)
            return caster;

        for(let unit of allUnits){
            if(this.validateTarget(caster, unit, true)){
                return unit;
            }
        }
        return null;
    }

    /**
     * Gets the numerical range value associated with the enumerated range value
     * @returns range as a number
     */
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

    /**
     * Gets an object that represents the current state of the ability
     * @returns state object
     */
    public getState():AbilityState{
        const {
            name, internalName, description
        } = this;

        return {
            name, internalName, description
        }
    }

    /**
     * Getter for the display name of the ability
     * @returns diplay name for the ability
     */
    public get name():string{
        return this._config.name;
    }

    /**
     * Getter for the internal name, or ability type
     * @returns the internale name for the ability
     */
    public get internalName():AbilityType{
        return this._config.internalName;
    }

    /**
     * Getter for the ability's description
     * @returns ability description text
     */
    public get description():string{
        return this._config.description;
    }

    /**
     * Getter for the amount of mana this ability requires to cast
     * @returns mana used to cast
     */
    public get manaCost():number{
        return this._config.manaCost;
    }

    /**
     * Getter for the type of targets that can be affected (not only initial target)
     * @returns subsequent target types
     */
    public get affects():AbilityTargets{
        return this._config.affects;
    }

    /**
     * Getter for the type of target this ability can be casted on
     * @returns initial target type
     */
    public get targets():AbilityTargets{
        return this._config.targets;
    }

    /**
     * Getter for the range of the ability
     * @returns ability range
     */
    public get range():AbilityRange{
        return this._config.range;
    }

    /**
     * Getter for the maximum amount of targets this ability can affect
     * @returns max targets affected per cast
     */
    public get maxTargets():number{
        return this._config.maxTargets;
    }

    /**
     * Getter for the recharge duration (in seconds)
     * @returns recharge time in seconds
     */
    public get recharge():number{
        return this._config.recharge;
    }

    /**
     * Getter for if the ability is recharged and ready to cast
     * @returns ready state
     */
    public get isReady():boolean{
        return this._ready;
    }
}