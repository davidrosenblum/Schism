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
export const BAD_USERNAME_REGEX:RegExp =            /[^a-z0-9]/gi;
export const BAD_PASSWORD_REGEX:RegExp =            /[^A-Za-z0-9!#@$%^&]/gi;
export const BAD_NAME_REGEX:RegExp =                /[^a-z0-9]/gi;
export const BAD_MAP_NAME_REGEX:RegExp =            /[&a-z0-9\s]/gi;

export const validate = (params:ValidationParams, cb:(err?:string)=>void):void => {
    const {
        input, inputName, lengths, invalidTest
    } = params;

    const [min, max] = lengths;

    if(input.length < min){
        cb(`${inputName} is too short, at least ${min} characters required.`);
        return;
    }

    if(input.length > max){
        cb(`${inputName} is too short, at most ${max} characters allowed.`);
        return;
    }

    if(invalidTest.test(input)){
        cb(`${inputName} contains invalid characters.`);
        return;
    }

    cb();
};

export const validateUsername = (username:string, cb:(err?:string)=>void):void => {
    validate({
        input:          username,
        inputName:      "Username",
        lengths:        USERNAME_LENGTHS,
        invalidTest:    BAD_USERNAME_REGEX 
    }, cb);
};

export const validatePassword = (password:string, cb:(err?:string)=>void):void => {
    validate({
        input:          password,
        inputName:      "Password",
        lengths:        PASSWORD_LENGTHS,
        invalidTest:    BAD_PASSWORD_REGEX 
    }, cb);
};

export const validateName = (name:string, cb:(err?:string)=>void):void => {
    validate({
        input:          name,
        inputName:      "Name",
        lengths:        NAME_LENGTHS,
        invalidTest:    BAD_NAME_REGEX 
    }, cb);
};

export const validateMapName = (name:string, cb:(err?:string)=>void):void => {
    validate({
        input:          name,
        inputName:      "Map name",
        lengths:        MAP_NAME_LENGTHS,
        invalidTest:    BAD_MAP_NAME_REGEX
    }, cb);
};

export const validateAccount = (username:string, password:string, cb:(err?:string)=>void):void => {
    validateUsername(username, err => {
        if(!err){
            validatePassword(password, cb);
        }
        else cb(err);
    });
};

export const Validator = {
    validateUsername, validatePassword, validateName, validateMapName, validateAccount
};