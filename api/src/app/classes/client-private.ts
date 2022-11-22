import BCConnectionPrivate from "./bc-connection-private";

export default class ClientPrivate extends BCConnectionPrivate{
    private construct(){
        
    }

    public async getPrivateClientByINE(collectionName:string, ine:string){
        return <any> new Promise(async (resolve, reject)=>{
            await this.connect();
            this.evaluateTransaction('PrivateQueryAssetByINE', collectionName, ine).then(result=>{
                resolve(result);
            }).catch(err=>{
                reject(err);
            }).finally(async ()=>{
                console.log('Desconnectado');
                await this.disconnect();
            });
        });
    }

    public async getClientByINE(ine:string){
        return new Promise(async (resolve, reject)=>{
            await this.connect();
            this.evaluateTransaction('QueryAssetByINE', ine).then(result=>{
                resolve(result);
            }).catch(err=>{
                reject(err);
            }).finally(async ()=>{
                await this.disconnect();
            });
        });
    }

    public async getAllClients(collectionName:string){
        return new Promise(async (resolve, reject)=>{
            await this.connect();
            this.evaluateTransaction('GetAllAssetPrivateCollection', collectionName).then(result=>{
                resolve(result);
            }).catch(err=>{
                reject(err);
            }).finally(async ()=>{
                await this.disconnect();
            });
        });
    }

    public async createAsset(params:any){
        return new Promise(async (resolve, reject)=>{
            let asset1Data = {
                "assetID": params.assetID,
                "telefono": params.telefono,
                "email": params.email,
                "pswrd": params.pswrd,
                "nombre": params.nombre,
                "apellidoPaterno": params.apellidoPaterno,
                "apellidoMaterno": params.apellidoMaterno,
                "curp": params.curp,
                "ineClv": params.ineClv,
                "anioDeRegistro": params.anioDeRegistro,
                "anioDeEmision": params.anioDeEmision,
                "vigencia": params.vigencia,
                "calle": params.calle,
                "numero": params.numero,
                "colonia": params.colonia,
                "localidad": params.localidad,
                "seccion": params.seccion,
                "municipio": params.municipio,
                "estado": params.estado,
                "codigoPostal": params.codigoPostal,
                "ocr": params.ocr,
                "idCiudadano": params.idCiudadano,
                "fechaDeNacimiento": params.fechaDeNacimiento,
                "nacionalidad": params.nacionalidad,
                "paisDeResidencia": params.paisDeResidencia,
                "tipoDeActividad": params.tipoDeActividad,
                "nivelParecido": params.nivelParecido,
                "domicilio": params.domicilio,
                "tipoDocumento": params.tipoDocumento,
                "fechaDeProceso": params.fechaDeProceso,
                "genero": params.genero,
                "mayorDeEdad": params.mayorDeEdad,
                "copiaBN": params.copiaBN,
                "pruebaDeVida": params.pruebaDeVida,
                "imgRostro": params.imgRostro,
                "imgRostroID": params.imgRostroID,
                "imgIDFrontal": params.imgIDFrontal,
                "imgIDTrasera": params.imgIDTrasera,
            };
            await this.connect();
            let isValid = true;

            await this.evaluateTransaction('PrivateExistAssetByStringField','Org1PrivateCollection',params.assetID, 'telefono', params.telefono).then(res=>{
                if(res){
                    throw('Telefono registrado');
                }
            }).catch(async err=>{
                reject({
                    type: 'validation',
                    message: 'El telefono que usaste fue registrado por otro cliente'
                });
                await this.disconnect();
                isValid = false;
            });

            if(!isValid)
                return 0;
                
            await this.evaluateTransaction('PrivateExistAssetByStringField','Org1PrivateCollection',params.assetID,'email', params.email).then(res=>{
                if(res){
                    throw('Email registrado');
                }
            }).catch(async err=>{
                reject({
                    type: 'validation',
                    message: 'El email que usaste fue registrado por otro cliente'
                });
                await this.disconnect();
                isValid = false;
            });

            if(!isValid)
                return 0;
                
            await this.evaluateTransaction('PrivateExistAssetByStringField','Org1PrivateCollection',params.assetID,'ineClv', params.ineClv).then(res=>{
                if(res){
                    throw('INE registrado');
                }
            }).catch(async err=>{
                reject({
                    type: 'validation',
                    message: 'La clave de ine que usaste fue registrada por otro cliente'
                });
                await this.disconnect();
                isValid = false;
            });

            if(!isValid)
                return 0;
            
            const privateCollection = "Org1PrivateCollection";
            this.createNewTransaction('CreateAssetPrivateCollectionOrg1', asset1Data, privateCollection).then(async resp=>{
                this.evaluateTransaction('ReadAssetPrivateDetails',privateCollection,params.assetID).then(newAsset=>{
                    resolve(newAsset);
                }).catch(err=>{
                    reject(err);
                }).finally(async ()=>{
                    await this.disconnect();
                });
            }).catch(async err=>{
                await this.disconnect();
                reject(err);
            })
        });
    }

    public async transferAsset(objRequest:any){
        return new Promise(async (resolve, reject)=>{
            await this.connect();
            this.createNewTransaction('TransferAssetToPrivateCollection', objRequest).then(newAsset=>{
                resolve(newAsset);
            }).catch(err=>{
                reject(err);
            }).finally(async ()=>{
                await this.disconnect();
            });
        });
    }

    public async updateAsset(scFunction:string, params:any, privateCollection: string){
        return new Promise(async (resolve, reject)=>{
            
            let assetID1 = params.assetID;
            let objAsset = {
                "assetID": params.assetID,
                "telefono": params.telefono,
                "email": params.email,
                "pswrd": params.pswrd,
                "nombre": params.nombre,
                "apellidoPaterno": params.apellidoPaterno,
                "apellidoMaterno": params.apellidoMaterno,
                "curp": params.curp,
                "ineClv": params.ineClv,
                "anioDeRegistro": params.anioDeRegistro,
                "anioDeEmision": params.anioDeEmision,
                "vigencia": params.vigencia,
                "calle": params.calle,
                "numero": params.numero,
                "colonia": params.colonia,
                "localidad": params.localidad,
                "seccion": params.seccion,
                "municipio": params.municipio,
                "estado": params.estado,
                "codigoPostal": params.codigoPostal,
                "ocr": params.ocr,
                "idCiudadano": params.idCiudadano,
                "fechaDeNacimiento": params.fechaDeNacimiento,
                "nacionalidad": params.nacionalidad,
                "paisDeResidencia": params.paisDeResidencia,
                "tipoDeActividad": params.tipoDeActividad,
                "domicilio": params.domicilio,
            };
        
            await this.connect();
            let isValid = await this.isValidField(privateCollection,params.assetID,'telefono',params.telefono);
            if(!isValid){
                reject({
                    type: 'validation',
                    message: 'El telefono que usaste fue registrado por otro cliente'
                });
                await this.disconnect();
                return 0;
            }

            isValid = await this.isValidField(privateCollection,params.assetID,'email',params.email);
            if(!isValid){
                reject({
                    type: 'validation',
                    message: 'El email que usaste fue registrado por otro cliente'
                });
                await this.disconnect();
                return 0;
            }

            isValid = await this.isValidField(privateCollection,params.assetID,'ineClv',params.ineClv);
            if(!isValid){
                reject({
                    type: 'validation',
                    message: 'La clave de ine que usaste fue registrado por otro cliente'
                });
                await this.disconnect();
                return 0;
            }
            
            this.createNewTransaction(scFunction, objAsset, privateCollection).then(async resp=>{
                this.evaluateTransaction('ReadAssetPrivateDetails',privateCollection,assetID1).then(newAsset=>{
                    resolve(newAsset);
                }).catch(err=>{
                    reject(err);
                }).finally(async ()=>{
                    await this.disconnect();
                });
            }).catch(async err=>{
                await this.disconnect();
                reject(err);
            })
        });
    }
    public async isValidField(privateCollection:string, assetID:string, fieldName: string, fieldValue: string){
        let isValid = true;
        try {
            await this.evaluateTransaction('PrivateExistAssetByStringField',privateCollection,assetID, fieldName, fieldValue).then(res=>{
                if(res){
                    throw(fieldValue + ' registrado');
                }
            }).catch(async err=>{
                console.error("Validation error: ", err)
                isValid = false;
            });
            return isValid;
        } catch (error) {
            return false;
        }
    }

    public async getCertificateIdentity(){
    await this.connect();
        let certificate = this.gateway.identity.credentials.certificate;
     await this.disconnect();
        return certificate;
    }
}
