import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions:any = {};
  constructor(private http: HttpClient) { }

  get(ruta){
    console.log(ruta);
    // this.setHeaders();
    return new Promise<any>((resolve,reject)=>{
      this.http.get(
        // environment.wsUrl + '/' + ruta,
        ruta,
        this.httpOptions
      ).subscribe(response=>{
        resolve(response);
      }, err=>{
        console.log('reject getAll');
        console.log(JSON.stringify(err));
        reject(err.error);
      });
    });
  }
  post(ruta,dataForm, blnFile=false){
    return new Promise<any>((resolve,reject)=>{
      this.http.post(
        // environment.wsUrl + '/' + ruta,
        ruta,
        dataForm,
      ).subscribe(response=>{
        resolve(response);
      }, err=>{
        // console.log('post reject');
        // console.log(err);
        reject(err.error);
      });
    });
  }

  put(ruta,dataForm, blnFile=false){
    return new Promise((resolve,reject)=>{
      this.http.put(
        // environment.wsUrl + '/' + ruta,
        ruta,
        dataForm,
      ).subscribe(response=>{
        // console.log('post resolve: ',response);
        resolve(response);
      }, err=>{
        //this.verificarLogin(err.error);
        console.log('post reject');
        console.log(err);
        reject(err.error);
      });
    });
  }

  delete(ruta){
    return new Promise((resolve,reject)=>{
      this.http.delete(
        environment.wsUrl + '/' + ruta,
        this.httpOptions
      ).subscribe(response=>{
        console.log('delete resolve');
        resolve(response);
      }, err=>{
        console.log('delete reject');
        console.log(err.error);
        reject(err.error);
      });
    });
  }


}
