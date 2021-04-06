import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class BaseService {

  BASE_URL = environment.ApiUrl;
  constructor(private httpClient: HttpClient) { }

  get(url: string) {
    return this.httpClient.get(`${this.BASE_URL}${url}`);
  }
  post(url: string, data: any) {
    return this.httpClient.post(`${this.BASE_URL}${url}`, data, {
      headers: { Accept: 'application/json' }
    });
  }
}
