const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');

const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./../utils/CAUtil');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./../utils/AppUtil');

const myChannel = 'mychannel';
const myChaincodeName = 'private';

const memberAssetCollectionName = 'Org1PrivateCollection';
const org1PrivateCollectionName = 'Org1AndOrg2PrivateCollection';
const org2PrivateCollectionName = 'Org2MSPPrivateCollection';
const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const Org1UserId = 'appUser1';
const Org2UserId = 'appUser2';


export default class EnrolService{
    
    private static _instance:any;

    private _ccp:any;
    private _wallet:any;

    private constructor(){}
    
    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    public async initContractFromOrg1Identity() {
        this._ccp = buildCCPOrg1();
    
        const caOrg1Client = buildCAClient(FabricCAServices, this._ccp, 'ica.org1.example.com');
    
        const walletPathOrg1 = path.join(__dirname, 'wallet/org1');
        this._wallet = await buildWallet(Wallets, walletPathOrg1);
    
        await enrollAdmin(caOrg1Client, this._wallet, mspOrg1);
        await registerAndEnrollUser(caOrg1Client, this._wallet, mspOrg1, Org1UserId, 'org1.department1');
    
        try {
            const gatewayOrg1 = new Gateway();
            await gatewayOrg1.connect(this._ccp,
                { wallet: this._wallet, identity: Org1UserId, discovery: { enabled: true, asLocalhost: true } });
    
            return gatewayOrg1;
        } catch (error) {
            console.error(`Error in connecting to gateway: ${error}`);
            process.exit(1);
        }
    }
    
    public async initContractFromOrg2Identity() {
        const ccpOrg2 = buildCCPOrg2();
        const caOrg2Client = buildCAClient(FabricCAServices, ccpOrg2, 'ica.org2.example.com');
    
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

    async enrol(){
        try {

            /** ******* Fabric client init: Using Org1 identity to Org1 Peer ********** */
            const gatewayOrg1 = await this.initContractFromOrg1Identity();
            const networkOrg1 = await gatewayOrg1.getNetwork(myChannel);
            const contractOrg1 = networkOrg1.getContract(myChaincodeName);
            // Since this sample chaincode uses, Private Data Collection level endorsement policy, addDiscoveryInterest
            // scopes the discovery service further to use the endorsement policies of collections, if any
            contractOrg1.addDiscoveryInterest({ name: myChaincodeName, collectionNames: [memberAssetCollectionName, org1PrivateCollectionName] });
    
            /** ~~~~~~~ Fabric client init: Using Org2 identity to Org2 Peer ~~~~~~~ */
            const gatewayOrg2 = await this.initContractFromOrg2Identity();
            const networkOrg2 = await gatewayOrg2.getNetwork(myChannel);
            const contractOrg2 = networkOrg2.getContract(myChaincodeName);
            contractOrg2.addDiscoveryInterest({ name: myChaincodeName, collectionNames: [memberAssetCollectionName, org2PrivateCollectionName] });

            // Disconnect from the gateway peer when all work for this client identity is complete
            gatewayOrg1.disconnect();
            gatewayOrg2.disconnect();
        } catch (error) {
            console.error(`Error in enrol process: ${error}`);
            if (error.stack) {
                console.error(error.stack);
            }
            process.exit(1);
        }

    }

    public cpp(){
        return this._ccp
    
    }

    public wallet(){
        return this._wallet;
    }

}