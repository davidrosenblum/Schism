import { Ability, AbilityTargets } from "../abilities/Ability";
import { Unit } from "../entities/Unit";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";

class AbilitiesControllerType{
    public processAbilityCast(user:User, {abilityName="", targetId=""}):void{
        if(!abilityName){
            UserUpdater.requestBodyError(user, "ability-cast");
            return;
        }

        if(!user.map || !user.player){
            UserUpdater.error(user, "ability-cast", "Not in a map.");
            return;
        }

        const ability:Ability = user.player.getAbility(abilityName);
        if(!ability){
            UserUpdater.error(user, "ability-cast", "You do not have that ability.");
            return;
        }

        let target:Unit;
        const allUnits:Unit[] = user.map.getAllUnits();

        if(ability.targets === AbilityTargets.SELF_ONLY){
            target = user.player;
        }
        else{
            target = user.map.getUnit(targetId) || ability.autoTarget(user.player, allUnits);
        }

        if(!target){
            UserUpdater.error(user, "ability-cast", "No target.");
            return;
        }

        ability.cast(user.player, target, allUnits, err => {
            if(!err){
                UserUpdater.abilityCasted(user, abilityName);
            }
            else{
                UserUpdater.error(user, "ability-cast", err);
            }
        });
    }
}

export const AbilitiesController = new AbilitiesControllerType();