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
source ~/.profile
source ~/.profile
sleep 2
go version

cd utils/
unzip main.zip
mv fabric-main/Makefile fabric-main/Makefile-OLD
cp Makefile fabric-main/Makefile
mv fabric-main/gossip/comm/conn.go fabric-main/gossip/comm/conn.go-OLD
cp conn.go fabric-main/gossip/comm/
cd fabric-main/
go mod tidy
go mod vendor
make clean-all 
make clean 
make check-deps 

ls gossip/comm/

# apt-get install -y golang-go
# apt-get reinstall -y golang-go
# sleep 2

curl -L -o ./install-misspell.sh https://git.io/misspell
sh ./install-misspell.sh
echo "export PATH=$PWD/bin:$PATH" >> ~/.profile
source ~/.profile
source ~/.profile
source ~/.profile
sleep 2

mv scripts/check_go_version.sh scripts/check_go_version.sh-OLD
cp ../check_go_version.sh scripts/

mv scripts/check_license.sh scripts/check_license.sh-OLD
cp ../check_license.sh scripts/


make

exit





