# Prueba de concepto Blockchain Privada  

Este repositorio contiene los archivos de los [ejemplos de Hyperledger Fabric](https://github.com/hyperledger/fabric-samples). 

En esta prueba de concepto se integraron procesos básicos de blockchain privada. 

## Prerequisitos
Antes de iniciar hay que asegurarnos que tenemos instalados los prerequisitos de acuerdo a lo señalado en la documentación de fabric.

[Prerequisitos Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html).

### Lista de comandos para ubuntu Debian GNU/Linux 11 (bullseye)

```
sudo apt update
sudo apt-get install git
sudo apt install curl

sudo apt-get remove docker docker-engine docker.io containerd runc

sudo apt-get install \
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

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo docker run hello-world

sudo groupadd docker

sudo usermod -aG docker $USER

newgrp docker

sudo systemctl start docker
sudo systemctl enable docker


sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Después de ejecutar los comandos [descargar golang](https://golang.org/dl/) version 1.18.7 

ir al directorio de descargas y ejecutar el comando 
```
mkdir tmp
cd tmp
sudo tar -C /usr/local -xzf go1.15.3.linux-amd64.tar.gz
```
Abrir el archivo para registrar el PATH de Go
```
sudo vi $HOME/.profile
```

Escribir al final del archivo la siguiente línea 
```
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$GOPATH/bin
```
Ejecutar el comando para actualizar el perfil
```
source ~/.profile
```
Verificar la instalación de go con el comando 
```
go version
```


Construir las imagenes 3.0.0 
```
cd utils

unzip main

cd fabric-main

curl -L -o ./install-misspell.sh https://git.io/misspell

sh ./install-misspell.sh

export PATH=$PWD/bin:$PATH

apt-get install golang-go


go mod tidy
go mod vendor


make

```

Descargar imagenes desde fuera del directorio bcBlockChain 
```
curl -sSL https://bit.ly/2ysbOFE | bash -s
```

## Descargar los binarios

Dentro del directorio bcBlockChain/network ejecutar el siguiente comando

```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- -d -s

export PATH=$PWD/bin:$PATH
```

## Prerequisito para la generación del material criptográfico propio


Actualizar la versión de openssl a 1.1.1d El paquete se encuentra en el directorio utils/ (por si llegara a fallar el comando wget).

```bash
sudo apt-get remove openssl
sudo apt-get remove --auto-remove openssl
cd utils/ or cd tmp/ si se va obtener con wget
# opcionalmente: wget https://www.openssl.org/source/openssl-1.1.1d.tar.gz
tar xvfz openssl-1.1.1d.tar.gz
cd openssl-1.1.1d
sudo apt-get install build-essential
sudo ./config
sudo make
sudo make install
sudo ldconfig
openssl version
OpenSSL 1.1.1d #ok!
cd ../../
rm -rf tmp/ 
```

## Test de API

Para descargar las dependencias ejecutar desde el directorio bcBlockChain/api:

```
sudo apt-get install python
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt install nodejs
npm install -g @angular/cli
npm install -g typescript


python --version #2.7.18  ok! 
node -v #v14.21.1 ok!
npm -v #6.14.17 ok!
ng version #Y,Y
tsc -v #Version 4.9.3 ok!

npm install
```

## Transpilar código

Set paths. Colocar las rutas absolutas de los directorios bcBlockChain/api, bcBlockChain/cryptography y bcBlockChain/network,  en el archivo src/environments/env.dev.ts

```javascript
export const URL_API = '<ruta-absoluta-al-directorio>/bcBlockChain/api';
export const URL_CRYPTOGRAPHY = '<ruta-absoluta-al-directorio>/bcBlockChain/cryptography';
export const URL_NETWORK = '<ruta-absoluta-al-directorio>/bcBlockChain/network';
```
Ejecutar el comando para tanspilar el proyecto.

```bash
tsc -w

[15:42:10] Starting compilation in watch mode...

[15:42:16] Found 0 errors. Watching for file changes.


# Cuando termine de transpilar CTRL+C
```

## Levantar el servidor middleware API

Desde el directorio bcBlockChain ejecutar el siguiente comando

```
nohup node api/dist/index.js &


# El servidor localmente se levanta en el puerto 5000, consultar al administrador de infraestructura
# por el puerto y la url a consumir por ejemplo:  https://bitcerohub.com.mx:9000/apis 
```

Si se desea monitorear la salida del servidor API ejecutar desde el directorio bcBlockChain 

```bash

tail -f nohup.out

```

## Generar el material criptográfico para las organizaciones


```bash

# Consumir la url: https://bitcerohub.mx:9000/apis/blockchain/cryptography
POST organization = nombre de la organización {org1.example.com, org2.example.com, org3.example.com} 

```
 

## Levantar, bajar y consultar el estado de la red

```bash

# Consumir la url: https://bitcerohub.com.mx:9000/apis/blockchain/network
POST up = número de operación a realizar {0: bajar la red,
                                          1: levantar la red,
                                          3: obtener estado de los pares,
                                          4: añadir tercera organización}

```
 
### License <a name="license"></a>

Hyperledger Project source code files are made available under the Apache
License, Version 2.0 (Apache-2.0), located in the [LICENSE](LICENSE) file.
Hyperledger Project documentation files are made available under the Creative
Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
