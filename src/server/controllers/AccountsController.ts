import { DBAccounts } from "../database/DBAccounts";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";

class AccountsControllerType{
    private _accounts:Map<string, User>; // username = user

    /**
     * Constructs an Account Controller object
     */
    constructor(){
        this._accounts = new Map();
    }

    /**
     * Handles login requests
     * @param user      requesting user
     * @param param1    request body
     */
    public processLogin(user:User, {username="", password="", version=""}):void{
        // request body must have username, password, and version
        if(!username || !password || !version){
            // username or password missing
            UserUpdater.requestBodyError(user, "login");
            return;
        }

        // validate client version?

        // must not be logged in
        if(user.account){
            UserUpdater.error(user, "login", "Already logged in.");
            return;
        }

        // get account from database
        DBAccounts.findAccount(username, password)
            .then(accountDoc => {
                // successfully found account
                // account must be not logged in
                if(this._accounts.has(username)){
                    // account already logged in
                    UserUpdater.error(user, "login", "Account already online.");
                    return;
                }

                this._accounts.set(username, user);     // store account = user
                user.account = accountDoc;              // store account data in user
                UserUpdater.loggedIn(user);             // update user 
            })
            .catch(err => {
                // database error - respond error
                UserUpdater.error(user, "login", err.message);
            });
    }

    /**
     * Handles logout requests
     * @param user  requesting user
     */
    public processLogout(user:User):void{
        // must be logged in
        if(!user.account){
            UserUpdater.notLoggedInError(user, "logout");
            return;
        }

        this.forceAvailable(user.username);     // force account to be open
        user.account = null;                    // delete account from user

        // leave current map 
        if(user.map){
            user.map.removeUser(user);
            user.map = null;
        }

        // destroy player
        if(user.player){
            user.player.destroy();
            user.player = null;
        }

        // update user
        UserUpdater.loggedOut(user)
    }

    /**
     * Forces the account to be available
     * @param username 
     */
    public forceAvailable(username:string):boolean{
        return this._accounts.delete(username);
    }

    /**
     * Gets a user object by username
     * @param username finds user with this username
     * @returns the user with the given username
     */
    public getUserFromUsername(username:string):User{
        return this._accounts.get(username);
    }
}

/**
 * Account Controller singleton
 */
export const AccountsController = new AccountsControllerType();