#!/bin/bash

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org3MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051
peer lifecycle chaincode package private.tar.gz --path ../asset-transfer-private-data/chaincode-go/ --lang golang --label private_1
peer lifecycle chaincode install private.tar.gz

packageChaincode() {
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  PACKAGE_ID=$(sed -n "/private_1/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
}

packageChaincode

## echo $PACKAGE_ID
export CC_PACKAGE_ID=$PACKAGE_ID

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID mychannel --name private --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --waitForEvent --signature-policy "OR ('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')" --collections-config ../asset-transfer-private-data/chaincode-go/kyc_collections_config.json

peer lifecycle chaincode querycommitted --channelID mychannel --name private --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
