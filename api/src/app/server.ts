import express from 'express';
import { SERVER_PORT } from '../environments/env.dev';

export default class Server{
    public app: express.Application;
    public port: number;
    private static _instance:Server;

    private constructor(){
        this.app = express();
        this.port = SERVER_PORT;
    }
    public static get instance(){
        return this._instance || (this._instance = new this());
    }
    start(callback: any){
        this.app.listen(this.port, callback);
    }

    
}