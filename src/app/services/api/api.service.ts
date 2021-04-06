import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private baseService: BaseService) { }

  getPlanets() {
    return this.baseService.get('/planets');
  }
  getVehicles() {
    return this.baseService.get('/planets');
  }
  getToken() {
    return this.baseService.post('/token', {});
  }
}
