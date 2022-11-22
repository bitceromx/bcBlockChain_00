# Prueba de concepto Blockchain KYC 

Este repositorio contiene los archivos de los [ejemplos de Hyperledger Fabric](https://github.com/hyperledger/fabric-samples). 

En esta prueba de concepto se integraron procesos básicos de kyc utilizando blockchain para instituciones bancarias. 

## Prerequisitos
Antes de iniciar hay que asegurarnos que tenemos instalados los prerequisitos de acuerdo a lo señalado en la documentación de fabric.

[Prerequisitos Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html).

### Lista de comandos para ubuntu Ubuntu 20.04.1 LTS

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

Después de ejecutar los comandos [descargar golang](https://golang.org/dl/) version 1.14.x o posterior 

ir al directorio de descargas y ejecutar el comando 
```
sudo tar -C /usr/local -xzf go1.15.3.linux-amd64.tar.gz
```
Abrir el archivo para registrar el PATH de Go
```
sudo vi $HOME/.profile
```

Escribir al final del archivo la siguiente línea 
```
export PATH=$PATH:/usr/local/go/bin
```
Ejecutar el comando para actualizar el perfil
```
source ~/.profile
```
Verificar la instalación de go con el comando 
```
go version
```
Verificar que todas la imágenes de docker estén instaladas 
```
docker images
```
Lista de imágenes 
```
REPOSITORY                   TAG                 IMAGE ID            CREATED             SIZE
hyperledger/fabric-ca        1.4                 dbbc768aec79        4 weeks ago         158MB
hyperledger/fabric-ca        1.4.9               dbbc768aec79        4 weeks ago         158MB
hyperledger/fabric-ca        latest              dbbc768aec79        4 weeks ago         158MB
hyperledger/fabric-tools     2.2                 e9b802fadb41        4 weeks ago         519MB
hyperledger/fabric-tools     2.2.1               e9b802fadb41        4 weeks ago         519MB
hyperledger/fabric-tools     latest              e9b802fadb41        4 weeks ago         519MB
hyperledger/fabric-peer      2.2                 ece149884124        4 weeks ago         55MB
hyperledger/fabric-peer      2.2.1               ece149884124        4 weeks ago         55MB
hyperledger/fabric-peer      latest              ece149884124        4 weeks ago         55MB
hyperledger/fabric-orderer   2.2                 78a16ddd2cf4        4 weeks ago         38.4MB
hyperledger/fabric-orderer   2.2.1               78a16ddd2cf4        4 weeks ago         38.4MB
hyperledger/fabric-orderer   latest              78a16ddd2cf4        4 weeks ago         38.4MB
hyperledger/fabric-ccenv     2.2                 8e554c280cac        4 weeks ago         586MB
hyperledger/fabric-ccenv     2.2.1               8e554c280cac        4 weeks ago         586MB
hyperledger/fabric-ccenv     latest              8e554c280cac        4 weeks ago         586MB
hyperledger/fabric-baseos    2.2                 0b99d26b26ad        4 weeks ago         6.85MB
hyperledger/fabric-baseos    2.2.1               0b99d26b26ad        4 weeks ago         6.85MB
hyperledger/fabric-baseos    latest              0b99d26b26ad        4 weeks ago         6.85MB
```
Si hacen falta imágenes correr el siguiente comando 
```
curl -sSL https://bit.ly/2ysbOFE | bash -s
```

## Descargar los binarios

Dentro del directorio rd-onboarding/network ejecutar el siguiente comando

```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- -d -s

export PATH=$PWD/bin:$PATH
```

## Prerequisito para la generación del material criptográfico propio


Actualizar la versión de openssl a 1.1.1d El paquete se encuentra en el directorio utils/ (por si llegara a fallar el comando wget).

```bash
sudo apt-get remove openssl
sudo apt-get remove --auto-remove openssl
cd utils/
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
```

## Test de API-KYC

Para descargar las dependencias ejecutar desde el directorio rd-onboarding/api:

```
npm install
```

## Transpilar código

Set paths. Colocar las rutas absolutas de los directorios rd-onboarding/api, rd-onboarding/cryptography y rd-onboarding/network,  en el archivo src/environments/env.dev.ts

```javascript
export const URL_API = '<ruta-absoluta-al-directorio>/rd-onboarding/api';
export const URL_CRYPTOGRAPHY = '<ruta-absoluta-al-directorio>/rd-onboarding/cryptography';
export const URL_NETWORK = '<ruta-absoluta-al-directorio>/rd-onboarding/network';
```
Ejecutar el comando para tanspilar el proyecto.

```bash
tsc -w

[15:42:10] Starting compilation in watch mode...

[15:42:16] Found 0 errors. Watching for file changes.


# Cuando termine de transpilar CTRL+C
```

## Levantar el servidor middleware API-KYC

Desde el directorio rd-onboarding ejecutar el siguiente comando

```
nohup node api/dist/index.js &


# El servidor localmente se levanta en el puerto 5000, consultar al administrador de infraestructura
# por el puerto y la url a consumir por ejemplo:  https://sodev.anzen.com.mx:9000/apis 
```

Si se desea monitorear la salida del servidor API-KYC ejecutar desde el directorio rd-onboarding

```bash

tail -f nohup.out

```

## Generar el material criptográfico para las organizaciones


```bash

# Consumir la url: https://sodev.anzen.com.mx:9000/apis/blockchain/cryptography
POST organization = nombre de la organización {org1.example.com, org2.example.com, org3.example.com} 

```
 

## Levantar, bajar y consultar el estado de la red

```bash

# Consumir la url: https://sodev.anzen.com.mx:9000/apis/blockchain/network
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
