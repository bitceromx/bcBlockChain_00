#/bin/sh

echo "---------------------"
echo $1 $2
echo "---------------------"

#set -e

mkdir ca-config
mkdir ca-config/tlsca

cp docker-compose.yaml-ORIGINAL-ORG2 docker-compose.yaml

cp fabric-ca-server-config.yaml-ORIGINAL-ORG2 ca-config/fabric-ca-server-config.yaml

cp fabric-ca-server-config.yaml-ORIGINAL-ORG2-TLSCA ca-config/tlsca/fabric-ca-server-config.yaml

cp configtx.yaml-ORIGINAL configtx.yaml
sed -i "s/Org1/$3/g" configtx.yaml
sed -i "s/org1/$2/g" configtx.yaml
sed -i "s/example/$1/g" configtx.yaml

cp openssl_root-tls.cnf-ORIGINAL openssl_root-tls.cnf
sed -i "s/org1/$2/g" openssl_root-tls.cnf
sed -i "s/example/$1/g" openssl_root-tls.cnf

cp openssl_root-identity.cnf-ORIGINAL openssl_root-identity.cnf
sed -i "s/org1/$2/g" openssl_root-identity.cnf
sed -i "s/example/$1/g" openssl_root-identity.cnf


export PATH=$PWD/bin:$PATH
export FABRIC_CFG_PATH=${PWD}

echo "Generating crypto-materials for Orderer Org.."
cryptogen generate --config=./crypto-config.yaml

ORG_DIR=$PWD/crypto-config/peerOrganizations/$2.$1.com
PEER_DIR=$ORG_DIR/peers/peer0.$2.$1.com
IDENTITY_REGISTRAR_DIR=$ORG_DIR/users/admin
TLS_REGISTRAR_DIR=$ORG_DIR/users/tlsadmin
ADMIN_DIR=$ORG_DIR/users/Admin@$2.$1.com
##OWNER_ORG2_DIR=$ORG_DIR/users/owner@$2.$1.com

mkdir -p $ORG_DIR $ORG_DIR/ca $ORG_DIR/tlsca $ORG_DIR/msp $PEER_DIR $IDENTITY_REGISTRAR_DIR $TLS_REGISTRAR_DIR $ADMIN_DIR 


echo "Creating Identity Root CA.."
mkdir -p identity-rca/private identity-rca/certs identity-rca/newcerts identity-rca/crl
touch identity-rca/index.txt identity-rca/serial
echo 1000 > identity-rca/serial
echo 1000 > identity-rca/crlnumber
openssl ecparam -name prime256v1 -genkey -noout -out identity-rca/private/rca.identity.$2.$1.com.key
openssl req -config openssl_root-identity.cnf -new -x509 -sha256 -extensions v3_ca -key identity-rca/private/rca.identity.$2.$1.com.key -out identity-rca/certs/rca.identity.$2.$1.com.cert -days 3650 -subj "/C=MX/ST=Cdmx/L=Cdmx/O=$2.$1.com/OU=/CN=rca.identity.$2.$1.com"

echo "Creating TLS Root CA.."
mkdir -p tls-rca/private tls-rca/certs tls-rca/newcerts tls-rca/crl
touch tls-rca/index.txt tls-rca/serial
echo 1000 > tls-rca/serial
echo 1000 > tls-rca/crlnumber
openssl ecparam -name prime256v1 -genkey -noout -out tls-rca/private/rca.tls.$2.$1.com.key
openssl req -config openssl_root-tls.cnf -new -x509 -sha256 -extensions v3_ca -key tls-rca/private/rca.tls.$2.$1.com.key -out tls-rca/certs/rca.tls.$2.$1.com.cert -days 3650 -subj "/C=MX/ST=Cdmx/L=Cdmx/O=$2.$1.com/OU=/CN=rca.tls.$2.$1.com"

echo "Creating and signing Identity Intermediate CA Cert.."
openssl ecparam -name prime256v1 -genkey -noout -out $ORG_DIR/ca/ica.identity.$2.$1.com.key
openssl req -new -sha256 -key $ORG_DIR/ca/ica.identity.$2.$1.com.key -out $ORG_DIR/ca/ica.identity.$2.$1.com.csr -subj "/C=MX/ST=Cdmx/L=Cdmx/O=$2.$1.com/OU=/CN=ica.identity.$2.$1.com"
openssl ca -batch -config openssl_root-identity.cnf -extensions v3_intermediate_ca -days 1825 -notext -md sha256 -in $ORG_DIR/ca/ica.identity.$2.$1.com.csr -out $ORG_DIR/ca/ica.identity.$2.$1.com.cert
cat $ORG_DIR/ca/ica.identity.$2.$1.com.cert $PWD/identity-rca/certs/rca.identity.$2.$1.com.cert > $ORG_DIR/ca/chain.identity.$2.$1.com.cert

echo "Creating and signing TLS Intermediate CA Cert.."
openssl ecparam -name prime256v1 -genkey -noout -out $ORG_DIR/tlsca/ica.tls.$2.$1.com.key
openssl req -new -sha256 -key $ORG_DIR/tlsca/ica.tls.$2.$1.com.key -out $ORG_DIR/tlsca/ica.tls.$2.$1.com.csr -subj "/C=MX/ST=Cdmx/L=Cdmx/O=$2.$1.com/OU=/CN=ica.tls.$2.$1.com"
openssl ca -batch -config openssl_root-tls.cnf -extensions v3_intermediate_ca -days 1825 -notext -md sha256 -in $ORG_DIR/tlsca/ica.tls.$2.$1.com.csr -out $ORG_DIR/tlsca/ica.tls.$2.$1.com.cert
cat $ORG_DIR/tlsca/ica.tls.$2.$1.com.cert $PWD/tls-rca/certs/rca.tls.$2.$1.com.cert > $ORG_DIR/tlsca/chain.tls.$2.$1.com.cert

echo "Starting Intermediate CA.."
docker-compose up -d ica.$2.$1.com

sleep 10

mkdir $2
cp -Rf ca-config/tls-cert.pem $2/
ls -la $2


echo "Sleeping for 1 minute before creating peer and user certs.."
sleep 55

echo "Registering and Enrolling Peer and User Identities.."
export FABRIC_CA_CLIENT_HOME=$IDENTITY_REGISTRAR_DIR
fabric-ca-client enroll --csr.hosts localhost --csr.hosts 127.0.0.1 --caname ca-org2 --csr.names C=MX,ST=Cdmx,L=Cdmx,O=$2.$1.com -m admin -u https://admin:adminpw@localhost:8054 --tls.certfiles ${PWD}/$2/tls-cert.pem 

echo "Sleeping for 30 seconds.."
sleep 35

fabric-ca-client register --caname ca-org2 --id.name Admin@$2.$1.com --id.secret mysecret --id.type admin --id.affiliation $2 -u https://localhost:8054 --tls.certfiles ${PWD}/$2/tls-cert.pem

fabric-ca-client register --caname ca-org2 --id.name peer0.$2.$1.com --id.secret mysecret --id.type peer --id.affiliation $2 -u https://localhost:8054 --tls.certfiles ${PWD}/$2/tls-cert.pem


export FABRIC_CA_CLIENT_HOME=$ADMIN_DIR
fabric-ca-client enroll --csr.hosts localhost --csr.hosts 127.0.0.1 --caname ca-org2 --csr.names C=MX,ST=Cdmx,L=Cdmx,O=$2.$1.com -m Admin@$2.$1.com -u https://Admin@$2.$1.com:mysecret@localhost:8054 --tls.certfiles ${PWD}/$2/tls-cert.pem
cp $ORG_DIR/ca/chain.identity.$2.$1.com.cert $ADMIN_DIR/msp/chain.cert
cp $PWD/nodeou.yaml $ADMIN_DIR/msp/config.yaml

export FABRIC_CA_CLIENT_HOME=$PEER_DIR
fabric-ca-client enroll --csr.hosts localhost --csr.hosts 127.0.0.1 --caname ca-org2 --csr.names C=MX,ST=Cdmx,L=Cdmx,O=$2.$1.com -m peer0.$2.$1.com -u https://peer0.$2.$1.com:mysecret@localhost:8054 --tls.certfiles ${PWD}/$2/tls-cert.pem
cp $ORG_DIR/ca/chain.identity.$2.$1.com.cert $PEER_DIR/msp/chain.cert
cp $PWD/nodeou.yaml $PEER_DIR/msp/config.yaml

echo "Registering and Enrolling Peer TLS Certificate-Key pair.."
export FABRIC_CA_CLIENT_HOME=$TLS_REGISTRAR_DIR
fabric-ca-client enroll --csr.hosts localhost --csr.hosts peer0.%2.$1.com --caname tlsca-org2 --csr.names C=MX,ST=Cdmx,L=Cdmx,O=$2.$1.com -m admin -u https://admin:adminpw@localhost:8054 --tls.certfiles ${PWD}/$2/tls-cert.pem

echo "Sleeping for 30 seconds.."
sleep 35

fabric-ca-client register --caname tlsca-org2 --id.name peer0.$2.$1.com --id.secret mysecret --id.type peer --id.affiliation $2 -u https://localhost:8054 --tls.certfiles ${PWD}/$2/tls-cert.pem
export FABRIC_CA_CLIENT_HOME=$PEER_DIR/tls
fabric-ca-client enroll --csr.hosts localhost --csr.hosts peer0.$2.$1.com --caname tlsca-org2 --csr.names C=MX,ST=Cdmx,L=Cdmx,O=$2.$1.com -m peer0.$2.$1.com -u https://peer0.$2.$1.com:mysecret@localhost:8054 --tls.certfiles ${PWD}/$2/tls-cert.pem
cp $PEER_DIR/tls/msp/signcerts/*.pem $PEER_DIR/tls/server.crt
cp $PEER_DIR/tls/msp/keystore/* $PEER_DIR/tls/server.key

cat $PEER_DIR/tls/msp/intermediatecerts/*.pem $PEER_DIR/tls/msp/cacerts/*.pem > $PEER_DIR/tls/ca.crt
rm -rf $PEER_DIR/tls/msp $PEER_DIR/tls/*.yaml

echo "Preparing $2.$1.com MSP.."
mkdir -p $ORG_DIR/msp/admincerts $ORG_DIR/msp/intermediatecerts $ORG_DIR/msp/cacerts $ORG_DIR/msp/tlscacerts $ORG_DIR/msp/tlsintermediatecerts
cp $PEER_DIR/msp/cacerts/*.pem $ORG_DIR/msp/cacerts/
cp $PEER_DIR/msp/intermediatecerts/*.pem $ORG_DIR/msp/intermediatecerts/
cp $PWD/tls-rca/certs/rca.tls.$2.$1.com.cert $ORG_DIR/msp/tlscacerts/
cp $ORG_DIR/tlsca/ica.tls.$2.$1.com.cert $ORG_DIR/msp/tlsintermediatecerts/

cp $ORG_DIR/ca/chain.identity.$2.$1.com.cert $ORG_DIR/msp/chain.cert
cp $PWD/nodeou.yaml $ORG_DIR/msp/config.yaml

echo "Finished generating crypto matter.."
 
cp crypto-config/peerOrganizations/$2.$1.com/tlsca/ica.tls.$2.$1.com.cert crypto-config/peerOrganizations/$2.$1.com/tlsca/tlsca.$2.$1.com-cert.pem

cp crypto-config/peerOrganizations/$2.$1.com/ca/ica.identity.$2.$1.com.cert crypto-config/peerOrganizations/$2.$1.com/ca/ca.$2.$1.com-cert.pem


cp crypto-config/peerOrganizations/$2.$1.com/ca/ica.identity.$2.$1.com.cert $2/ca-cert.pem

cp crypto-config/peerOrganizations/$2.$1.com/ca/ica.identity.$2.$1.com.cert ca-config/ca-cert.pem

cp ca-config/tls-cert.pem $2/

rm -Rf $2/fabric-ca-server-config.yaml-ORIGINAL
rm -Rf $2/fabric-ca-server-config.yaml-ORIGINAL-OLD
rm -Rf $2/tlsca

cp fabric-ca-client-config.yaml crypto-config/peerOrganizations/$2.$1.com/

cp ${PWD}/fabric-ca-client-config.yaml ${PWD}/crypto-config/peerOrganizations/$2.$1.com/
export FABRIC_CA_CLIENT_HOME=${PWD}/crypto-config/peerOrganizations/$2.$1.com/

cp -Rf crypto-config/peerOrganizations/$2.$1.com ../
cp -Rf ca-config/ ../ca-config-$2.$1.com
cp -Rf identity-rca ../identity-rca-$2.$1.com
cp -Rf tls-rca ../tls-rca-$2.$1.com

exit


