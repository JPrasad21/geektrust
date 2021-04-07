import { Injectable } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { FindFalconeRequest } from '../typings/falcone';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private api: ApiService) { }

  getPlanets() {
    return this.api.getPlanets();
  }
  getVehicles() {
    return this.api.getVehicles();
  }
  getToken(){
    return this.api.getToken();
  }
  findFalcone(query: FindFalconeRequest) {
    return this.api.findFalcone(query);
  }
}
