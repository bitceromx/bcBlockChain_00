# API para la prueba de concepto Blockchain KYC 

Este proyecto es una API RESTful que realiza las peticiones a la red de [blockchain KYC](https://github.com/anzen/blockchain) para realizar operaciones del proceso "expediente del cliente".

Contiene los servicios:
- Registro de asset 
- Consulta de asset org1 y org2
- Transferencia de asset

## Prerequisitos
- Instalar nodeJS y typescript.
- Arrancar la red hasta completar el punto ["Arranque de la POC"](https://github.com/anzen/blockchain#arranque-de-la-poc)

## Arrancar API

Desde la raíz del proyecto ejecutar el siguiente comando para descargar las dependencias.

```
npm install
```

## Modificar el archivo env.dev.ts

Modificar el archivo **src/environments/env.dev.ts**. 

La constante **URL_NETWORK** deberá apuntar al directorio raiz del proyecto de la red de blockchain.


## Transpilar código

Ejecutar el comando para tanspilar el proyecto.

```
tsc
```

Verificar que el proyecto transpilado se encuentre en el directorio **dist**.

Ejecutar el API con el comando

```
node dist/index.js
```

El API realizará los procesos de registro y enrolamiento de los usuarios para interactuar con la red de blockchain.


## Endpoints

### GET 
**Obtener asset por clave ine del estado publico**
localhost:5000/blockchain/kyc/clients/:clave_ine 
**Obtener todos los asset de la colección privada de la organización 1**
localhost:5000/blockchain/kyc/org1/clients 
**Obtener asset por clave ine de la colección privada de la organización 1**
localhost:5000/blockchain/kyc/org1/clients/:clave_ine 
**Obtener todos los asset de la colección privada de la organización 2**
localhost:5000/blockchain/kyc/org2/clients 

### POST 

**Registrar asset en la organización 1** 
localhost:5000/blockchain/kyc/org1/clients 

**Ejemplo de body request**

```javascript
{
    "assetID": "asset1",
    "telefono": "55365451",
    "email": "elmail@eldominio.com",
    "pswrd": "password",
    "nombre": "Nombre",
    "apellidoPaterno": "Paterno",
    "apellidoMaterno": "Materno",
    "curp": "ELR92374YHS8YC04",
    "ineClv": "001",
    "anioDeRegistro": "1900",
    "anioDeEmision": "1900",
    "vigencia": "2021",
    "calle": "Calle",
    "numero": 5,
    "colonia": "La colonia",
    "localidad": "La localidad",
    "seccion": "Seccion",
    "municipio": "Municipio",
    "estado": "Estado",
    "codigoPostal": "15300",
    "ocr": "OCR",
    "idCiudadano": "7823tygdbwh",
    "fechaDeNacimiento": "12-12-1900",
    "nacionalidad":"Mexicana",
    "paisDeResidencia": "Mexico",
    "tipoDeActividad": "Nivel 1",
    "nivelParecido":"ALTO",
    "domicilio":"Domicilio completo",
    "tipoDocumento":"19",
    "fechaDeProceso":"01-01-2021",
    "genero":"Masculino",
    "mayorDeEdad":"1",
    "copiaBN":"0",
    "pruebaDeVida":"1",
    "imgRostro":"Base64",
    "imgRostroID":"Base64",
    "imgIDFrontal":"Base64",
    "imgIDTrasera":"Base64"
}
```
**Transferir asset de la organización 1 a la organización 2**
localhost:5000/blockchain/kyc/org2/clients/transfer 
**Ejemplo de body request**
```javascript
{
    "assetID":"aseet1",
    "org1": "Org1",
    "org2": "Org2"
}
```

### PUT
**Actualizar asset en la organización 2** 
localhost:5000/blockchain/kyc/org2/clients 
**Ejemplo de body request**
```javascript
{
    "assetID": "asset1",
    "telefono": "55365451",
    "email": "elmail@eldominio.com",
    "pswrd": "password",
    "nombre": "Nombre",
    "apellidoPaterno": "Paterno",
    "apellidoMaterno": "Materno",
    "curp": "ELR92374YHS8YC04",
    "ineClv": "001",
    "anioDeRegistro": "1900",
    "anioDeEmision": "1900",
    "vigencia": "2021",
    "calle": "Calle",
    "numero": 5,
    "colonia": "La colonia",
    "localidad": "La localidad",
    "seccion": "Seccion",
    "municipio": "Municipio",
    "estado": "Estado",
    "codigoPostal": "15300",
    "ocr": "OCR",
    "idCiudadano": "7823tygdbwh",
    "fechaDeNacimiento": "12-12-1900",
    "nacionalidad":"Mexicana",
    "paisDeResidencia": "Mexico",
    "tipoDeActividad": "Nivel 1",
    "domicilio":"Domicilio completo"
}
```

**Actualizar asset en la organización 1** 
localhost:5000/blockchain/kyc/org1/clients 
**Ejemplo de body request**
```javascript

    "assetID": "asset1",
    "telefono": "55365451",
    "email": "elmail@eldominio.com",
    "pswrd": "password",
    "nombre": "Nombre",
    "apellidoPaterno": "Paterno",
    "apellidoMaterno": "Materno",
    "curp": "ELR92374YHS8YC04",
    "ineClv": "001",
    "anioDeRegistro": "1900",
    "anioDeEmision": "1900",
    "vigencia": "2021",
    "calle": "Calle",
    "numero": 5,
    "colonia": "La colonia",
    "localidad": "La localidad",
    "seccion": "Seccion",
    "municipio": "Municipio",
    "estado": "Estado",
    "codigoPostal": "15300",
    "ocr": "OCR",
    "idCiudadano": "7823tygdbwh",
    "fechaDeNacimiento": "12-12-1900",
    "nacionalidad":"Mexicana",
    "paisDeResidencia": "Mexico",
    "tipoDeActividad": "Nivel 1",
    "domicilio":"Domicilio completo"
}
```

**Validación**

La API enviará un objeto con el estatus y el mensaje de la validación en el caso de ingresar un teléfono, clave ine o email que ya se encuentren registrados en la red de blockchain. El status response será 422 Unprocessable Entity.


```javascript
{
    "status": "Validation",
    "message": "Mensajer de la validación"
}
```

**Error**

La API enviará un objeto con el estatus y el mensaje de la validación en el caso de que el request genere algún error. El status response será 500 Internal Server Error.

```javascript
{
    "status": "Error",
    "message": "No valid responses from any peers. Errors:\n    peer=peer0.org1.example.com:7051, status=500, message=this asset already exists: asset1"
}
```