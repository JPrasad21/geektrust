import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FindFalconeRequest, FindFalconeResponse, Planets, TokenResponse, Vehicles } from 'src/app/typings/falcone';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private baseService: BaseService) { }

  getPlanets(): Observable<Planets[]> {
    return this.baseService.get('/planets') as Observable<Planets[]>;
  }
  getVehicles(): Observable<Vehicles[]> {
    return this.baseService.get('/vehicles') as Observable<Vehicles[]>;
  }
  getToken(): Observable<TokenResponse> {
    return this.baseService.post('/token', {}) as Observable<TokenResponse>;
  }
  findFalcone(query: FindFalconeRequest): Observable<FindFalconeResponse> {
    return this.baseService.post('/find', query) as Observable<FindFalconeResponse>;
  }
}
