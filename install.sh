#!/bin/bash

sudo apt update
sudo apt-get install git
sudo apt install curl

sudo apt-get remove docker docker-engine docker.io containerd runc

sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo docker run hello-world

sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker

sudo systemctl start docker
sudo systemctl enable docker


sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose



mkdir tmp
cd tmp
wget https://go.dev/dl/go1.18.7.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.18.7.linux-amd64.tar.gz

echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.profile
echo "export PATH=$PATH:$GOPATH/bin" >> ~/.profile




