import { Request, Response } from "express";
import { DBAccounts } from "../database/DBAccounts";
import { Validator } from '../utils/Validator';

const post = (req:Request, res:Response) => {
    const {username, password} = req.body;

    if(!username || !password){
        res.status(400).end("Missing username or password.");
        return;
    }

    Validator.validateAccount(username, password, err => {
        if(err){
            res.status(400).end(err);
            return;
        }
        
        DBAccounts.insertAccount(username, password)
            .then(() => {
                res.status(200).end(`Account "${username}" created.`);
            })
            .catch(err => {
                if(err.code === 11000){
                    res.status(400).end(`Account name "${username}" is unavailable.`);
                }
                else{
                    // console.log(err.message);
                    res.status(500).end("Server error.");
                }
            });
    });    
};

export const AccountCreate = {post};