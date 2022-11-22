#/bin/bash
cp -Rf nodeou.yaml ../network/network/
cp -Rf ca-config-org1.example.com ../network/network/
cp -Rf ca-config-org2.example.com ../network/network/
cp -Rf identity-rca-org1.example.com ../network/network/
cp -Rf identity-rca-org2.example.com ../network/network/
cp -Rf tls-rca-org1.example.com ../network/network/
cp -Rf tls-rca-org2.example.com ../network/network/
cp docker-compose-ca.yaml ../network/network/docker/
cp registerEnroll.sh ../network/network/organizations/fabric-ca/
cp network.sh ../network/network/
chown -R $1:$1 ../network/network/
chown -R $1:$1 ../cryptography

