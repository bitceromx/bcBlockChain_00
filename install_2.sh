#!/bin/bash


sudo apt-get install -y build-essential

mkdir tmp
cd tmp
wget https://go.dev/dl/go1.18.7.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.18.7.linux-amd64.tar.gz
cd ..
rm -rf tmp

echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.profile

source ~/.profile
go version

cd utils/
unzip main.zip
mv fabric-main/gossip/comm/conn.go fabric-main/gossip/comm/conn.go-OLD
cp conn.go fabric-main/gossip/comm/
cd fabric-main/
go mod tidy
go mod vendor
make check-deps 

ls gossip/comm/

make

exit





