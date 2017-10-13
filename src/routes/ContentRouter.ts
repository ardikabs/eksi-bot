import { Router, Request, Response, NextFunction } from 'express';
import * as linebot from 'linebot';
class ContentRouter{

    router:Router;
    
    
    constructor(){
        this.router = Router();
        this.routes();
    }

    public getImageById(req:Request,res:Response,next:NextFunction){
        const bot = linebot({
            channelId: process.env.CHANNEL_ID,
            channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
            channelSecret: process.env.CHANNEL_SECRET,
            verify: true
        });

        let messageId = req.params.messageId;

        try{
            bot.getMessageContent(messageId)
                .then((content)=>{
                    var img = new Buffer(content, 'base64');
                
                    res.writeHead(200, {
                        'Content-Type': 'image/jpg',
                        'Content-Length': img.length
                    });
                    res.end(img);
                })
                .catch((err)=>{

                });
        }
        catch(e){
            console.log(e);
        }
        
    }

    public getVideoById(req:Request,res:Response,next:NextFunction){
        const bot = linebot({
            channelId: process.env.CHANNEL_ID,
            channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
            channelSecret: process.env.CHANNEL_SECRET,
            verify: true
        });

        let messageId = req.params.messageId;

        try{
            bot.getMessageContent(messageId)
                .then((content)=>{
                    var vid = new Buffer(content, 'base64');
                
                    res.writeHead(200, {
                        'Content-Type': 'video/mp4',
                        'Content-Length': vid.length
                    });
                    res.end(vid);
                })
                .catch((err)=>{

                });
        }
        catch(e){
            console.log(e);
        }
        
    }

    public getAudioById(req:Request,res:Response,next:NextFunction){
        const bot = linebot({
            channelId: process.env.CHANNEL_ID,
            channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
            channelSecret: process.env.CHANNEL_SECRET,
            verify: true
        });

        let messageId = req.params.messageId;

        try{
            bot.getMessageContent(messageId)
                .then((content)=>{
                    var audi = new Buffer(content, 'base64');
                
                    res.writeHead(200, {
                        'Content-Type': 'audio/mpeg',
                        'Content-Length': audi.length
                    });
                    res.end(audi);
                })
                .catch((err)=>{

                });
        }
        catch(e){
            console.log(e);
        }
        
    }

    public getNothing(req:Request,res:Response,next:NextFunction){
        res.send("Nothing");
    }

    // Assign Route list to the router
    routes(){
        this.router.get('/',this.getNothing);        
        this.router.get('/image/:messageId',this.getImageById);
        this.router.get('/video/:messageId',this.getVideoById);
        this.router.get('/audio/:messageId',this.getAudioById);
        
    }   
    
}

const sample = new ContentRouter();
sample.routes();

const router = sample.router;
export default router;