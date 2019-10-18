import { Ability, AbilityTargets, AbilityType } from "../abilities/Ability";
import { Unit } from "../entities/Unit";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";

class AbilitiesControllerType{
    /**
     * Handles ability cast requests
     * @param user      requesting user
     * @param param1    request body
     */
    public processAbilityCast(user:User, {abilityName="", targetId=""}):void{
        // validate request body
        if(!abilityName){
            UserUpdater.requestBodyError(user, "ability-cast");
            return;
        }

        // must be in a map with an active player
        if(!user.map || !user.player){
            UserUpdater.error(user, "ability-cast", "Not in a map.");
            return;
        }

        // get the ability (user's player must have learned it)
        const ability:Ability = user.player.getAbility(abilityName as AbilityType);
        if(!ability){
            UserUpdater.error(user, "ability-cast", "You do not have that ability.");
            return;
        }

        // prepare target object and get all possible targets (all units)
        let target:Unit;
        const allUnits:Unit[] = user.map.getAllUnits();

        //  get target object
        if(ability.targets === AbilityTargets.SELF_ONLY)
            target = user.player;
        else
            target = user.map.getUnit(targetId);
            // target = user.map.getUnit(targetId) || ability.autoTarget(user.player, allUnits);

        // must have a target selected in order to cast
        if(!target){
            UserUpdater.error(user, "ability-cast", "No target.");
            return;
        }

        // cast the ability
        ability.cast(user.player, target, allUnits, err => {
            if(!err){
                // success, send update
                UserUpdater.abilityCasted(user, abilityName);
            }
            else{
                // error, send error
                UserUpdater.error(user, "ability-cast", err);
            }
        });
    }
}

/**
 * Abilities Controller singleton
 */
export const AbilitiesController = new AbilitiesControllerType();