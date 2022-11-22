## Añadiendo una organización a la red

# Material criptográfico para la organización 3
Desde el direcorio rd-onboarding/cryptography/makeCrypt ejecutar:
```
sudo ./start.sh-ORG3 example org3 Org3

sudo ./destroy.sh example org3 

```
Desde el direcorio rd-onboarding/cryptography ejecutar:

```
sudo ./places.sh-ORG3 $USER
 
```


# Añadiendo la organización 

```

# Desde el direcorio network/network/network-extra ejecutar:

./addOrg3.sh up -ca


# Desde el direcorio network/network ejecutar:

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org3MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

peer lifecycle chaincode package private.tar.gz --path ../asset-transfer-private-data/chaincode-go/ --lang golang --label private_1
peer lifecycle chaincode install private.tar.gz
peer lifecycle chaincode queryinstalled

# En el siguiente comando colocar el valor obtenido prevamente
export CC_PACKAGE_ID=private_1:c135290bf6f34676951321ee367a738057e210ad40a236286057f5e4f08a21b0

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID mychannel --name private --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --waitForEvent --signature-policy "OR ('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')" --collections-config ../asset-transfer-private-data/chaincode-go/kyc_collections_config.json

peer lifecycle chaincode querycommitted --channelID mychannel --name private --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

```

For more information, use `./addOrg3.sh -h` to see the `addOrg3.sh` help text.
