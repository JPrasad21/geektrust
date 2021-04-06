import { Component, OnInit } from '@angular/core';
import { Planets, PlanetsViewModel, Vehicles } from '../typings/falcone';
import { GameService } from './game.service';
import {MatSelectChange} from '@angular/material/select';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  planetList: Planets[] = [];
  vehicles: Vehicles[] = [];

  planetsModel: PlanetsViewModel[] = [];
  remaningVehicles: Vehicles[] = [];
  overAllTimeTaken = 0;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.getPlanets();
    this.getVehicles();
  }

  getPlanets() {
    this.gameService.getPlanets().subscribe(res => {
      this.planetList = res;
      this.planetsModel = res as PlanetsViewModel[];
    }, err => {
      console.log(err);
    })
  }

  getVehicles() {
    this.gameService.getVehicles().subscribe(res => {
      this.vehicles = res;
      this.remaningVehicles = res;
    }, err => {
      console.log(err);
    })
  }

  onPlanetSelect(planet: PlanetsViewModel) {
    const selectedPlanets = this.planetsModel.filter(x => x.isSelected);
    if(planet.isSelected || selectedPlanets.length < 4)
      planet.isSelected = !planet.isSelected;
    else
      console.log('Maximum of 4 planets can be selected');
  }

  onVehicleSelection(e: MatSelectChange, planet: PlanetsViewModel) {
    const vehicle = e.value as Vehicles;
    if(this.canAssignVehicleToPlanet(planet, vehicle)) {
      this.updateRemainingVehicles(vehicle, planet.selectedVehicle);
      planet.selectedVehicle = vehicle;
      planet.timeTaken = planet.distance / vehicle.speed;
      this.overAllTimeTaken = this.planetsModel.reduce((a, c) => a+= c.timeTaken ? c.timeTaken : 0, 0);
    } else {
      console.log('Vehicle cannot travel this distance');
      planet.selectedVehicle = null;
    }

  }

  canAssignVehicleToPlanet(planet: PlanetsViewModel, vehicle: Vehicles) {
    return vehicle.max_distance >= planet.distance;
  }

  updateRemainingVehicles(selectedVehicle: Vehicles, prevVehicle: Vehicles) {
    for(let i= this.remaningVehicles.length - 1; i >= 0; i--) {
      const vehicle = this.remaningVehicles[i];
      if(vehicle.name === selectedVehicle.name ) {
        if(vehicle.total_no > 0) vehicle.total_no -=1;
      }
      if(prevVehicle && vehicle.name === prevVehicle.name) {
        vehicle.total_no +=1;
      }
    }
  }
}
