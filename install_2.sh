#!/bin/bash


sudo apt-get install -y build-essential

mkdir tmp
cd tmp
wget https://go.dev/dl/go1.15.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.18.7.linux-amd64.tar.gz
cd ..
rm -rf tmp

echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.profile
echo "export PATH=$PATH:$GOPATH/bin" >> ~/.profile

source ~/.profile
go version

cd utils/
mv fabric-main/gossip/comm/conn.go fabric-main/gossip/comm/conn.go-OLD
cp conn.go fabric-main/gossip/comm/
cd fabric-main/
make check-deps 

ls gossip/comm/

exit





