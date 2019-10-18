import { PlayerSchema, DBPlayers } from "../database/DBPlayers";
import { Player, PlayerEvent, PlayerArchetype } from "../entities/Player";
import { User } from "../users/User";
import { UserUpdater } from '../users/UserUpdater';

/**
 * Restores a player from database save and gives its default archetype abilities and sets up event listeners
 * @param user      player's owner
 * @param saveData  database player data
 */
const setupPlayer = (user:User, saveData:PlayerSchema):void => {
    // instantiate player using database data
    user.player = new Player(saveData, user.id);
    // give default abilities
    giveDefaultAbilities(user.player);
    // attach event listeners
    user.player.onPlayerUpdate = evt => onPlayerUpdate(user, evt);
};

/**
 * Gives archetype default abilities to the restored player 
 * @param player player object just built from database data
 */
const giveDefaultAbilities = (player:Player):void => {
    switch(player.archetype){
        case PlayerArchetype.ALCHEMIST:
            player.learnAbilities(["alchemist1", "alchemist2", "alchemist3", "alchemist4"]);
            break;

        case PlayerArchetype.RANGER:
            player.learnAbilities(["ranger1", "ranger2", "ranger3", "ranger4"]);
            break;

        case PlayerArchetype.KNIGHT:
            player.learnAbilities(["knight1", "knight2", "knight3", "knight4"]);
            break;
    }
};

/**
 * Listener for when a player update occurs
 * @param user  player's owner 
 * @param evt   player update event
 */
const onPlayerUpdate = (user:User, evt:PlayerEvent):void => {
    const {target, data, message} = evt;

    // send optional chat update
    if(message)
        UserUpdater.chat(user, message);

    // send stats update to the owner 
    UserUpdater.statsUpdated(user, target.id, target.getStats());

    // update the database
    DBPlayers.updatePlayer(target.name, data).catch(err => {
        console.log(`Database error: unable to update ${target.name}.\n${err.message}`);
    });
};

// export in an object
export const PlayerManager = {
    setupPlayer
};