import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  async get(url: string) {
    this.http.get(url).subscribe(resp => {
      return resp;
    });
  }
  async post(data, url: string) {
    this.http.post(url, data).subscribe(resp => {
      return resp;
    });
    // .toPromise();
    // return resp;

  }

}
