import Server from "./src/app/server";
import { router } from "./src/app/app-routing";
import cors from 'cors';
import bodyParser from 'body-parser';

(async () => {
const server = Server.instance;
    server.app.use(bodyParser.urlencoded({extended:true}));
    server.app.use(bodyParser.json({limit: '50mb'}));
    server.app.use(cors({ origin:true, credentials:true }));
    server.app.use('/', router);

    server.start(()=>{
        console.log('\nEl servidor esta corriendo en el puerto: ' + server.port);
        
    });
})();
