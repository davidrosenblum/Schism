export const parseJson = (json:string, cb:(err?:Error, object?:any)=>void):void => {
    let object:any;

    try{
        object = JSON.parse(json);
    }
    catch(err){
        cb(err);
        return;
    }

    cb(null, object);
};

export const stringifyJson = (object:any, cb:(err?:Error, json?:string)=>void, pretty:boolean=false):void => {
    let str:string;

    try{
        str = pretty ? JSON.stringify(object, null, 4) : JSON.stringify(object);
    }
    catch(err){
        cb(err);
        return;
    }

    cb(null, str);
};