import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideoIdService {

  constructor(private http: HttpClient) { }

  authorization() {
    const url = 'https://etrust-sandbox.electronicid.eu/v2/videoid.request';
    const headers = {
      'Authorization': 'Bearer 3cc1ead3-debc-4a4a-bb38-c24b0f73414c',
      'content-type': 'application/json'
    }

    return new Promise<any>((resolve, reject) => {
      this.http.post(
        url,
        {},
        {
          headers: headers
        }
      ).subscribe(response => {
        resolve(response)
      }, error => {
        reject(error.error)
      });
    });
  }

  getInfo(videoId) {
    const url = 'https://etrust-sandbox.electronicid.eu/v2/videoid/'+videoId;
    const headers = {
      'Authorization': 'Bearer 3cc1ead3-debc-4a4a-bb38-c24b0f73414c',
      'tenantid': '9b20e185-b43b-4500-b16c-68c48ad00493',
      'secret': '7b7d56f4616138e7872b288483fbdf69'
    }

    return new Promise<any>((resolve, reject) => {
      this.http.get(
        url,
        {
          headers: headers
        }
      ).subscribe(response => {
        resolve(response)
      }, error => {
        reject(error.error)
      });
    });
  }
}
