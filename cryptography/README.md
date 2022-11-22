# Crypto-Anzen material para Blockchain KYC

## Generación del material criptográfico propio

Si no se cuenta con material criptografico propio generado previamente continuar con las instrucciones del README.md del directorio makeCrypt/ antes de continuar con la siguiente sección.

## Colocación del material criptográfico generado previamente

Desde el directorio  anzen-digital-crypt/ ejecutar:

```bash
 sudo ./places.sh $USER
```

## Arranque de la POC

Desde el directorio ../test-network ejecutar:

```bash
./network.sh up createChannel -ca -s couchdb

./network.sh deployCC -ccn private -ccep "OR('Org1MSP.peer','Org2MSP.peer')" -cccg ../asset-transfer-private-data/chaincode-go/kyc_collections_config.json
```

## Test de indentidades a través de API

Desde el directorio asset-transfer-private-data/application-javascript

```bash
npm install
rm -rf wallet
node app.js

Se considera salida exitosa:

..

**************** As Org1 Client ****************
Adding Assets to work with:
--> Submit Transaction: CreateAsset asset1
2020-11-19T19:56:22.189Z - error: [Transaction]: Error: No valid responses from any peers. Errors:

..
```

## Verificar la correcta generación de certificados

Del archivo wallet/org1/admin.id quitar los caracteres \n y colocar en el archivo admin.crt:

```bash
-----BEGIN CERTIFICATE-----
MIIB4TCCAYigAwIBAgIULc5rD0GILNi8/hIkjKrn31kYncowCgYIKoZIzj0EAwIw
XzELMAkGA1UEBhMCTVgxDTALBgNVBAgMBENkbXgxGTAXBgNVBAoMEG9yZzEuZXhh
bXBsZS5jb20xJjAkBgNVBAMMHWljYS5pZGVudGl0eS5vcmcxLmV4YW1wbGUuY29t
MB4XDTIwMTExOTE4NDA1OVoXDTIxMTExOTE4NDEwMFowITEPMA0GA1UECxMGY2xp
ZW50MQ4wDAYDVQQDEwVhZG1pbjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABBTs
FyPX/0QeVTrjqv2MQYfVvmpnB+9fHEbq8yUFxepbpMvPGucmw1rna8SAjQ2tZjjF
IXBffmXj0y3I/cBvqA6jYDBeMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAA
MB0GA1UdDgQWBBSVdcuTZ3M/XSpmhSvyOjx+24ljzzAfBgNVHSMEGDAWgBTF/t4d
hNAOO4f7HyiS/CSkRYw9bDAKBggqhkjOPQQDAgNHADBEAiAv++ek8HpMcZ1DqOVk
7waHFANWR2gfGyYLnxbmvDOP1wIgEsD3KHjQWrO9HsDlMxO1Fgze7GqKtbmSEOGq
3rNKLaQ=
-----END CERTIFICATE-----

```

Verificar el emisor:

```bash
openssl x509 -in admin.crt -text
```

Verificar el CN del emisor:

```bash
Issuer: C = MX, ST = Cdmx, O = org1.example.com, CN = ica.identity.org1.example.com
```


