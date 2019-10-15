import { Player, PlayerEvent, PlayerArchetype } from '../entities/Player';
import { PlayerSchema, DBPlayers } from '../database/DBPlayers';
import { User } from "../users/User";
import { UserUpdater } from '../users/UserUpdater';

const setupPlayer = (user:User, saveData:PlayerSchema):void => {
    user.player = new Player(saveData, user.id);

    giveDefaultAbilities(user.player);

    user.player.onPlayerUpdate = evt => onPlayerUpdate(user, evt);
};

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

const onPlayerUpdate = (user:User, evt:PlayerEvent):void => {
    const {target, data, message} = evt;

    if(message){
        UserUpdater.chat(user, message);
    }

    UserUpdater.statsUpdated(user, target.id, target.getStats());

    DBPlayers.updatePlayer(target.name, data).catch(err => {
        console.log(`Database error: unable to update ${target.name}.\n${err.message}`);
    });
};

export const PlayerManager = {
    setupPlayer
};