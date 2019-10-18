import { PlayerManager } from "./PlayerManager";
import { DBPlayers } from "../database/DBPlayers";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";
import { Validator } from "../utils/Validator";

class PlayersControllerType{
    /**
     * Handles player list request
     * @param user  requesting user
     */
    public processPlayerList(user:User):void{
        // must be logged in
        if(!user.account){
            // not logged in
            UserUpdater.notLoggedInError(user, "player-list");
            return;
        }

        // get player list from database
        DBPlayers.findPlayerList(user.accountId)
            .then(list => {
                // got player list - respond list
                UserUpdater.playerList(user, list);
            })
            .catch(() => {
                // database error - respond error
                UserUpdater.error(user, "player-list", "Server error.");
            });
    }

    /**
     * Handles player create request
     * @param user      requesting user
     * @param param1    request body
     */
    public processPlayerCreate(user:User, {name="", archetype=1}):void{
        // request body must have name and archetype
        if(!name || !archetype){
            // missing name or archetype
            UserUpdater.requestBodyError(user, "player-create");
            return;
        }

        // must be logged in
        if(!user.account){
            // not logged in
            UserUpdater.notLoggedInError(user, "player-create");
            return;
        }

        // validate player name
        Validator.validateName(name, err => {
            if(err){
                // invalid name
                UserUpdater.error(user, "player-create", err);
                return;
            }

            // valid name - create player in database
            DBPlayers.insertPlayer(user.accountId, name, archetype)
                .then(() => {
                    // success - respond 
                    UserUpdater.playerCreated(user);
                    this.processPlayerSelect(user, {name});
                })
                .catch(err => {
                    // database error - respond error
                    if(err.code === 11000){
                        UserUpdater.error(user, "player-create", `Name "${name}" is unavailable.`);
                    }
                    else{
                        console.log(err.message);
                        UserUpdater.error(user, "player-create", "Server error.");
                    }
                });
        });
    }

    /**
     * Handles player delete request
     * @param user      requesting user 
     * @param param1    request body 
     */
    public processPlayerDelete(user:User, {name=""}):void{
        // request body must have name
        if(!name){
            // no name
            UserUpdater.requestBodyError(user, "player-delete");
            return;
        }

        // must be logged in
        if(!user.account){
            // not logged in
            UserUpdater.notLoggedInError(user, "player-delete");
            return;
        }

        // delete player from database
        DBPlayers.deletePlayer(user.accountId, name)
            .then(() => {
                // success - respond 
                UserUpdater.playerDeleted(user);
            })
            .catch(err => {
                // database error - respond error
                UserUpdater.error(user, "player-delete", err);
            });
    }

    /**
     * Handles player select request
     * @param user      requesting user
     * @param param1    request body 
     */
    public processPlayerSelect(user:User, {name=""}):void{
        // request body must have name
        if(!name){
            // no name
            UserUpdater.requestBodyError(user, "player-select");
            return;
        }

        // must be logged in
        if(!user.account){
            // not logged in
            UserUpdater.notLoggedInError(user, "player-select");
            return;
        }

        // must not have a selected player
        if(user.player){
            // already selected a player
            UserUpdater.error(user, "player-select", "Already have an active player.");
            return;
        }

        // get player data from database
        DBPlayers.findPlayer(user.accountId, name)
            .then(playerDoc => {
                // success - create player and respond
                PlayerManager.setupPlayer(user, playerDoc);
                UserUpdater.playerSelected(user, user.player.getState());
            })
            .catch(err => {
                // database error - respond error
                UserUpdater.error(user, "player-select", err);
            });
    }
}

/**
 * Players Controller singleton
 */
export const PlayersController = new PlayersControllerType();