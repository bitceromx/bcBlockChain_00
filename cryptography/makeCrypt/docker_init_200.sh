#/bin/bash

docker rmi $(docker images)
docker volume prune
docker kill $(docker ps -q)
docker rm $(docker ps -qa)
docker system prune -a 
docker volumes prune -a 

curl -sSL https://bit.ly/2ysbOFE | bash -s
##curl -sSL http://bit.ly/2ysbOFE | bash -s -- 2.2.1 1.4.9 0.4.18 -d -s

## https://hub.docker.com/r/hyperledger/fabric-ca/tags/
docker pull couchdb:3.1
docker pull hyperledger/fabric-orderer:2.2.1
docker pull hyperledger/fabric-ca:1.4.9
docker pull hyperledger/fabric-tools:2.2.1
docker pull hyperledger/fabric-peer:2.2.1
docker pull hyperledger/fabric-ccenv:2.2.1

#docker tag couchdb:3.1 couchdb:latest
#docker tag hyperledger/fabric-orderer:2.2.1 hyperledger/fabric-orderer:latest
#docker tag hyperledger/fabric-peer:2.2.1 hyperledger/fabric-peer:latest
#docker tag hyperledger/fabric-ca:1.4.9 hyperledger/fabric-ca:latest
#docker tag hyperledger/fabric-tools:2.2.1 hyperledger/fabric-tools:latest
#docker tag hyperledger/fabric-ccenv:2.2.1 hyperledger/fabric-ccenv:latest


