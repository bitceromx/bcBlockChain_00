#/bin/sh

echo "Destroying all components.."

docker-compose down

docker rm -f $(docker ps -a | grep chaincode1 | awk '{print $1}')

rm -Rf ca-config
rm -Rf docker-compose.yaml
rm -Rf configtx.yaml
rm -Rf conn_1 conn_2
rm -Rf ca-config/fabric-ca-server-config.yaml
rm -Rf ca-config/tlsca/fabric-ca-server-config.yaml
rm -Rf openssl_root-*.cnf
rm -Rf connection-*.yaml
rm -Rf config/* crypto-config identity-rca tls-rca newica
rm -Rf ca-config/msp ca-config/*.db ca-config/IssuerPublicKey ca-config/IssuerRevocationPublicKey
rm -Rf newca-config/msp newca-config/*.db newca-config/IssuerPublicKey newca-config/IssuerRevocationPublicKey
rm -Rf ca-config/tlsca/msp ca-config/tlsca/*.db ca-config/tlsca/IssuerPublicKey ca-config/tlsca/IssuerRevocationPublicKey
rm -Rf $2 
##rm -Rf ../ca-config-$2 
##rm -Rf ../$2.$1.com 

echo "Done!!"
