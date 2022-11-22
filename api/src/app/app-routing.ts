import { Router, Request, Response } from 'express';
import ClientPrivate from './classes/client-private';
import * as constants from './../environments/env.dev';
import EnrolService from "./services/enrol-service";

import * as cp from 'child_process';
import * as path from 'path';
var sleep = require ('sleep');

export const router = Router();

const clientPrivate = new ClientPrivate();

router.get('/blockchain/kyc/clients/:ine', ( req: Request, resp: Response)=>{
    const ine = req.params.ine;
    
    clientPrivate.getClientByINE(ine).then(asset=>{
        resp.json({
            status: 'OK',
            asset: asset
        });
    }).catch(err=>{
        resp.status(500);
        resp.json({
            status: 'Error',
            message: err.message,
        });
    });
});

router.get('/blockchain/kyc/org1/clients/:ine', ( req: Request, resp: Response)=>{
    const ine = req.params.ine;
    clientPrivate.getPrivateClientByINE('Org1PrivateCollection',ine).then(asset=>{
        resp.json({
            status: 'OK',
            asset: asset.pop() || null
        });
    }).catch(err=>{
        resp.status(500);
        resp.json({
            status: 'Error',
            message: err.message,
        });
    });
});

router.get('/blockchain/kyc/org1/clients', async ( req: Request, resp: Response)=>{
    let allClients = await clientPrivate.getAllClients('Org1PrivateCollection');
    resp.json({
        ok: true,
        message: 'All clients',
        clients: allClients
    });
});

router.get('/blockchain/kyc/org2/clients', async ( req: Request, resp: Response)=>{
    let allClients = await clientPrivate.getAllClients('Org1AndOrg2PrivateCollection');
    resp.json({
        ok: true,
        message: 'All clients',
        clients: allClients
    });
});

router.post('/blockchain/kyc/org1/clients', async ( req: Request, resp: Response)=>{
    clientPrivate.createAsset(req.body).then(newAsset=>{
        resp.json({
            status: 'OK',
            message: 'El Asset se registro de forma correcta',
            asset: newAsset
        });
    }).catch(err=>{
        const statuscode = err.type === 'validation' ? 422: 500;
        const status = err.type === 'validation' ? 'Validation': 'Error';
        resp.status(statuscode);
        resp.json({
            status: status,
            message: err.message,
        });
    });

});

router.post('/blockchain/kyc/org2/clients/transfer', async ( req: Request, resp: Response)=>{
    const assetID:string = req.body.assetID;
    const org1:string = req.body.org1;
    const org2:string = req.body.org1;

    const objRequest = {
        assetID,
        org1,
        org2
    }
    clientPrivate.transferAsset(objRequest).then(_=>{
        resp.json({
            status: 'OK',
            message: 'Transferencia completa',
        });
    }).catch(err=>{
        console.log('app routing error',err);
        resp.status(500);
        resp.json({
            status: 'Error',
            message: err.message,
        });
    });
});

router.put('/blockchain/kyc/org1/clients', async ( req: Request, resp: Response)=>{
    clientPrivate.updateAsset('UpdateAssetPrivateCollectionOrg1',req.body,'Org1PrivateCollection').then(newAsset=>{
        resp.json({
            status: 'OK',
            message: 'El Asset se actualizó de forma correcta',
            asset: newAsset
        });
    }).catch(err=>{
        resp.status(500);
        resp.json({
            status: 'Error',
            message: err.message,
        });
    });

});

router.put('/blockchain/kyc/org2/clients', async ( req: Request, resp: Response)=>{
    clientPrivate.updateAsset('UpdateAssetPrivateCollection',req.body, 'Org1AndOrg2PrivateCollection').then(newAsset=>{
        resp.json({
            status: 'OK',
            message: 'El Asset se actualizó de forma correcta',
            asset: newAsset
        });
    }).catch(err=>{
        resp.status(500);
        resp.json({
            status: 'Error',
            message: err.message,
        });
    });

});

///

router.get('/blockchain/kyc/org1/certificate', async ( req: Request, resp: Response)=>{
var child_process = require("child_process");
var cmd='';

if(req.body.organization!=null && req.body.ca==null && req.body.user==null)
cmd = 'openssl x509 -in ' + constants.URL_NETWORK+'/network/organizations/peerOrganizations/' + req.body.organization + '/ca/ica.identity.' + req.body.organization  + '.cert' + ' -text';
else if(req.body.organization!=null && req.body.ca!=null && req.body.user==null)
cmd = 'openssl x509 -in ' + constants.URL_NETWORK+'/network/tls-rca-' + req.body.organization + '/certs/rca.tls.' + req.body.organization  + '.cert' + ' -text';
else if(req.body.organization==null && req.body.ca==null && req.body.user!=null)
{
        let certificateIdentity = await clientPrivate.getCertificateIdentity();
        var fs2 = require('fs');
        fs2.writeFileSync('./cert.crt', certificateIdentity, function () {
        });

        cmd = 'openssl x509 -in ' + './cert.crt'  + ' -text';
}

var resultCommand = child_process.execSync(cmd);
var infoCerts = resultCommand.toString().split(/\r?\n/);

    resp.json({
        ok: true,
        message: 'InfoCerts',
        result: infoCerts
    });
});

router.post('/blockchain/cryptography', async ( req: Request, resp: Response)=>{

        console.log('req.body.organization: ',req.body.organization);
        var child_process = require("child_process");
        var cmd='';
        var resultCommand;

        if(req.body.organization == "org1.example.com")
        {
        console.log('init Cryptography for org1.example.com ..: ', constants.URL_CRYPTOGRAPHY);

        cmd = 'echo \'toor\' | sudo -S ./destroy.sh example org1';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

        cmd = 'echo \'toor\' | sudo -S ./start.sh-ORG1 example org1 Org1';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

        cmd = 'echo \'toor\' | sudo -S ./places.sh-ORG1 $USER';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/' });

        cmd = 'echo \'toor\' | sudo -S ./destroy.sh example org1';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

    resp.json({
        ok: true,
        message: 'Cryptography generated succesfull'
    });
        console.log('end Cryptography for org1.example.com ..');
        return;
        }

       if(req.body.organization == "org2.example.com")
        {
        console.log('init Cryptography for org2.example.com ..: ', constants.URL_CRYPTOGRAPHY);

        cmd = 'echo \'toor\' | sudo -S ./destroy.sh example org2';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

        cmd = 'echo \'toor\' | sudo -S ./start.sh-ORG2 example org2 Org2';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

        cmd = 'echo \'toor\' | sudo -S ./places.sh-ORG2 $USER';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/' });

        cmd = 'echo \'toor\' | sudo -S ./destroy.sh example org2';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

    resp.json({
        ok: true,
        message: 'Cryptography generated succesfull'
    });
        console.log('end Cryptography for org2.example.com ..');
        return;
        }

        if(req.body.organization == "org3.example.com")
        {
        console.log('init Cryptography for org3.example.com ..: ', constants.URL_CRYPTOGRAPHY);

        cmd = 'echo \'toor\' | sudo -S ./destroy.sh example org3';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

        cmd = 'echo \'toor\' | sudo -S ./start.sh-ORG3 example org3 Org3';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

        cmd = 'echo \'toor\' | sudo -S ./places.sh-ORG3 $USER';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/' });

        cmd = 'echo \'toor\' | sudo -S ./destroy.sh example org3';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/makeCrypt/' });

    resp.json({
        ok: true,
        message: 'Cryptography generated succesfull'
    });
        console.log('end Cryptography for org3.example.com ..');
        return;
        }
});


router.post('/blockchain/network', async ( req: Request, resp: Response)=>{
        var child_process = require("child_process");
        var cmd='';
        var resultCommand;


        if(req.body.up == '0')
        {
        console.log('init down network..');


        cmd = 'echo \'toor\' | sudo -S rm -rf wallet ';
try{
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_API+'/dist/src/app/services/' });
}
catch (error) {
        console.log('F 0..');
            }

        cmd = 'echo \'toor\' | sudo -S ./network.sh down';
try{
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_NETWORK+'/network/' });
}
catch (error) {
        console.log('F 1..');
            }



        cmd = 'echo \'toor\' | sudo -S ./places.sh $USER';
try {
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_CRYPTOGRAPHY+'/' });
}
catch (error) {
        console.log('F 2..');
            }

    	resp.json({
        	ok: true,
        	message: 'Network down..'
    	});
        console.log('end down network..');
        return;
        }

        else if(req.body.up == '1')
        {

        console.log('init up network & deploying..');

var num:number = 2;
do{

        console.log('\n\n\nnetwork.sh up createChannel -ca -s couchdb do-while: '+num);
        cmd = './network.sh up createChannel -ca -s couchdb';
try{
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_NETWORK+'/network/' });
		num=0;
}
catch (error) {
        console.log('\n\n...............F 2b   ---- FALTA Desinstalar el chaincode de org1 o bajar toda la red y levantarla desde backup previo..\n\n');

// https://github.com/hyperledger-labs/fabric-opssc/issues/7
//
// Desinstalar el chaincode de org1
//        cmd = 'docker rmi $(docker images cc_* -q)';
//        resultCommand = child_process.execSync(cmd, { cwd: constants.URL_NETWORK+'/network/' });

	num++;
            }
}while(num>=2);

        console.log('deploy network..');

        cmd = './network.sh deployCC -ccn private -ccv 1.0 -ccs 1 -ccep \"OR(\'Org1MSP.peer\',\'Org2MSP.peer\',\'Org3MSP.peer\')\"  -cccg ../smart-contract/chaincode-go/kyc_collections_config.json -ccp ../smart-contract/chaincode-go/ -ccl go';
try{
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_NETWORK+'/network/' });
}
catch (error) {
        console.log('F 3..');
            }

        console.log('end up network & deploying..');

        cmd = 'tsc -w';
                resultCommand = child_process.exec(cmd, { cwd: constants.URL_API+'/' });


        cmd = 'echo \'toor\' | sudo -S rm -rf wallet';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_API+'/dist/src/app/services/' });

        const enrolService = EnrolService.instance;

num = 2;
do{
try{

        console.log('\n\n\nawait enrolService.enrol() do-while :'+num);
        await enrolService.enrol();
	num=0;
}
catch (error) {
        console.log('FG 1..');
	num++;
            }
}while(num>=2);

    	resp.json({
        	ok: true,
        	message: 'Network up..'
    	});
        console.log('end up network..');
       	return;
        }

        else if(req.body.up == '3')
        {

        cmd = 'echo \'toor\' | sudo -S docker ps -a';
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_NETWORK+'/network/' });
                var statusOrgs = resultCommand.toString();

                var result = [];
                if(statusOrgs.includes('peer0.org1.example.com'))
                        result.push({org: 'peer0.org1.example.com', status: 'up'});
                else
                        result.push({org: 'peer0.org1.example.com', status: 'down'});

                if(statusOrgs.includes('peer0.org2.example.com'))
                        result.push({org: 'peer0.org2.example.com', status: 'up'});
                else
                        result.push({org: 'peer0.org2.example.com', status: 'down'});

                if(statusOrgs.includes('peer0.org3.example.com'))
                        result.push({org: 'peer0.org3.example.com', status: 'up'});
                else
                        result.push({org: 'peer0.org3.example.com', status: 'down'});

	    resp.json({
        	ok: true,
        	message: 'Status Organizations..',
        	orgStatus: result
    	});
        console.log('end Status organizations..');
        return;
        }

        else if(req.body.up == '4')
        {
        console.log('init Append 3st organization..');

        cmd = './addOrg3.sh up -ca';

try{
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_NETWORK+'/network/network-extra/' });
}
catch (error) {
        console.log('\n\nF 222..');
            }

        cmd = './3st.sh';
try{
                resultCommand = child_process.execSync(cmd, { cwd: constants.URL_NETWORK+'/network/' });
}

catch (error) {
        console.log('\n\nF 222b..');
            }

		var m_result = resultCommand.toString().split(/\r?\n/);
		console.log('m_result: ', m_result);

        resp.json({
                ok: true,
                message: m_result[3]
        });
        console.log('end Append 3st organization..');
        return;
        }


});


