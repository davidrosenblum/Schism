export interface ValidationParams{
    input:string;
    inputName:string;
    lengths:[number, number];
    invalidTest:RegExp;
}

export const USERNAME_LENGTHS:[number, number] =    [3, 15];
export const PASSWORD_LENGTHS:[number, number] =    [5, 20];
export const NAME_LENGTHS:[number, number] =        [3, 10];
export const MAP_NAME_LENGTHS:[number, number] =    [3, 15];
export const MAP_PW_LENGTHS:[number, number] =      [0, 15];
export const BAD_USERNAME_REGEX:RegExp =            /[^a-z0-9]/gi;
export const BAD_PASSWORD_REGEX:RegExp =            /[^A-Za-z0-9!#@$%^&]/gi;
export const BAD_NAME_REGEX:RegExp =                /[^a-z0-9]/gi;
export const BAD_MAP_NAME_REGEX:RegExp =            /[^a-z0-9]/gi;

/**
 * Validates user input based on configuration
 * @param params    validation parameters 
 * @param cb        callback with helpful error
 */
export const validate = (params:ValidationParams, cb:(err?:string)=>void):void => {
    const {
        input, inputName, lengths, invalidTest
    } = params;

    const [min, max] = lengths;

    // enforce minimum length
    if(input.length < min){
        cb(`${inputName} is too short, at least ${min} characters required.`);
        return;
    }

    // enforce maximum length
    if(input.length > max){
        cb(`${inputName} is too short, at most ${max} characters allowed.`);
        return;
    }

    // enforce valid characters
    if(invalidTest.test(input)){
        cb(`${inputName} contains invalid characters.`);
        return;
    }

    // valid
    cb();
};

/**
 * Validates account username input
 * @param username  account username input
 * @param cb        callback with helpful error
 */
export const validateUsername = (username:string, cb:(err?:string)=>void):void => {
    validate({
        input:          username,
        inputName:      "Username",
        lengths:        USERNAME_LENGTHS,
        invalidTest:    BAD_USERNAME_REGEX 
    }, cb);
};

/**
 * Validates account password input
 * @param password  account password input
 * @param cb        callback with helpful error
 */
export const validatePassword = (password:string, cb:(err?:string)=>void):void => {
    validate({
        input:          password,
        inputName:      "Password",
        lengths:        PASSWORD_LENGTHS,
        invalidTest:    BAD_PASSWORD_REGEX 
    }, cb);
};

/**
 * Validates player name input
 * @param name  player name input
 * @param cb    callback with helpful error
 */
export const validateName = (name:string, cb:(err?:string)=>void):void => {
    validate({
        input:          name,
        inputName:      "Name",
        lengths:        NAME_LENGTHS,
        invalidTest:    BAD_NAME_REGEX 
    }, cb);
};

/**
 * Validates custom map name
 * @param name  custom map name input
 * @param cb    callback with helpful error
 */
export const validateMapName = (name:string, cb:(err?:string)=>void):void => {
    validate({
        input:          name,
        inputName:      "Map name",
        lengths:        MAP_NAME_LENGTHS,
        invalidTest:    BAD_MAP_NAME_REGEX
    }, cb);
};

/**
 * Validates optional map passwords.
 * @param password  The optional map password.
 * @param cb        Callback with helpful error.
 */
export const validateMapPassword = (password:string, cb:(err?:string)=>void):void => {
    validate({
        input:          password,
        inputName:      "Map password",
        lengths:        MAP_PW_LENGTHS,
        invalidTest:    BAD_PASSWORD_REGEX
    }, cb);
};

/**
 * 
 * @param username  account username input
 * @param password  account password input
 * @param cb        callback with helpful error
 */
export const validateAccount = (username:string, password:string, cb:(err?:string)=>void):void => {
    validateUsername(username, err => {
        if(!err)
            validatePassword(password, cb);
        else
            cb(err);
    });
};

/**
 * Validates map custom names and optional passwords.
 * @param name      The custom map name.
 * @param password  The optional map password.
 * @param cb        Callback with helpful error.
 */
export const validateMap = (name:string, password:string, cb:(err?:string)=>void):void => {
    validateMapName(name, err => {
        if(!err)
            validateMapPassword(password, cb);
        else
            cb(err);
    });
};

// export as an object
export const Validator = {
    validateUsername, validatePassword, validateName, validateMapName, validateMapPassword, validateAccount, validateMap
};