import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from '../services/api/api.service';
import { FindFalconeRequest, FindFalconeResponse } from '../typings/falcone';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  falconeSearchResult: FindFalconeResponse;
  reset$ = new Subject<boolean>();
  constructor(private api: ApiService) { }

  getPlanets() {
    return this.api.getPlanets();
  }
  getVehicles() {
    return this.api.getVehicles();
  }
  getToken() {
    return this.api.getToken();
  }
  findFalcone(query: FindFalconeRequest) {
    return this.api.findFalcone(query);
  }
  cloneObject(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}
