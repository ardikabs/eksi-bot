import { Router, Request, Response, NextFunction } from 'express';
import * as linebot from 'linebot';
import config from '../config/main';



class SampleRouter{

    router:Router;

    constructor(){
        this.router = Router();
        this.routes();
    }

    public getAllRestaurant(req:Request,res:Response,next:NextFunction){

    }

    // Assign Route list to the router
    routes(){
        this.router.get('/',this.getAllRestaurant);
    }   
    
}

const sample = new SampleRouter();
sample.routes();

const router = sample.router;
export default sample;