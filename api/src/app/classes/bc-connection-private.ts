const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
import EnrolService from '../services/enrol-service';

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./../utils/CAUtil');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./../utils/AppUtil');

const myChannel = 'mychannel';
const myChaincodeName = 'private';

const memberAssetCollectionName = 'Org1PrivateCollection';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const Org1UserId = 'appUser1';
const Org2UserId = 'appUser2';

export default class BCConnectionPrivate{

    private contract:any;
    public gateway:any;
    private enrolService:EnrolService;
    

    public constructor(){
        this.enrolService = EnrolService.instance;
    }

    public async initContractFromOrg1Identity() {
        const ccpOrg1 = buildCCPOrg1();
    
        const caOrg1Client = buildCAClient(FabricCAServices, ccpOrg1, 'ca.org1.example.com');
    
        const walletPathOrg1 = path.join(__dirname, 'wallet/org1');
        const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);
    
        await enrollAdmin(caOrg1Client, walletOrg1, mspOrg1);
        await registerAndEnrollUser(caOrg1Client, walletOrg1, mspOrg1, Org1UserId, 'org1.department1');
    
        try {
            const gatewayOrg1 = new Gateway();
            await gatewayOrg1.connect(ccpOrg1,
                { wallet: walletOrg1, identity: Org1UserId, discovery: { enabled: true, asLocalhost: true } });
    
            return gatewayOrg1;
        } catch (error) {
            console.error(`Error in connecting to gateway: ${error}`);
            process.exit(1);
        }
    }
    
    public async initContractFromOrg2Identity() {
        const ccpOrg2 = buildCCPOrg2();
        const caOrg2Client = buildCAClient(FabricCAServices, ccpOrg2, 'ca.org2.example.com');
    
        const walletPathOrg2 = path.join(__dirname, 'wallet/org2');
        const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);
    
        await enrollAdmin(caOrg2Client, walletOrg2, mspOrg2);
        await registerAndEnrollUser(caOrg2Client, walletOrg2, mspOrg2, Org2UserId, 'org2.department1');
    
        try {
            const gatewayOrg2 = new Gateway();
            await gatewayOrg2.connect(ccpOrg2,
                { wallet: walletOrg2, identity: Org2UserId, discovery: { enabled: true, asLocalhost: true } });
    
            return gatewayOrg2;
        } catch (error) {
            console.error(`Error in connecting to gateway: ${error}`);
            process.exit(1);
        }
    }

    public async createNewTransaction(...args:any[]){
        const scFunction:string = args[0];
        const arg1:string = args[1]?args[1]:'';
        const arg2:string = args[2]?args[2]:'';
        const arg3:string = args[3]?args[3]:'';
        return new Promise(async (resolve,reject)=>{
            try {
        
                let statefulTxn = await this.contract.createTransaction(scFunction);
                statefulTxn.setEndorsingOrganizations(mspOrg1);
                let tmapData = Buffer.from(JSON.stringify(arg1));
                statefulTxn.setTransient({
                    asset_properties: tmapData,
                    private_collection: arg2
                });
                let result = await statefulTxn.submit();
                if(result.toString()){
                    resolve(JSON.parse(result.toString()));
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
                
            }
        });
    }
    public async submitTransaction(scFuncion:string){
        
        return await this.contract.submitTransaction(scFuncion);
    }
    public async evaluateTransaction(...args:any[]){
        return new Promise(async (resolve,reject)=>{
            try {
                const scFunction:string = args[0];
                const arg1:string = args[1]?args[1]:'';
                const arg2:string = args[2]?args[2]:'';
                const arg3:string = args[3]?args[3]:'';
                const arg4:string = args[4]?args[4]:'';
        
                const result = await this.contract.evaluateTransaction(scFunction, arg1, arg2, arg3, arg4);
                if(result.toString()){
                    resolve(JSON.parse(result.toString()));
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    public async connect(){
        try {
            const ccpOrg1 = this.enrolService.cpp();
    
        const wallet = this.enrolService.wallet();

        this.gateway = new Gateway();
        await this.gateway.connect(ccpOrg1,
            { wallet: wallet, identity: Org1UserId, discovery: { enabled: true, asLocalhost: true } });
        
        const networkOrg1 = await this.gateway.getNetwork(myChannel);
        this.contract = networkOrg1.getContract(myChaincodeName);
        } catch (error) {
            console.error('Error connect: ', error);
        }
    }
    public disconnect(){
        this.gateway.disconnect();
    }
    
}
