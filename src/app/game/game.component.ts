import { Component, OnInit } from '@angular/core';
import { FindFalconeRequest, Planets, PlanetsViewModel, Vehicles } from '../typings/falcone';
import { GameService } from './game.service';
import {MatSelectChange} from '@angular/material/select';
import { Router } from '@angular/router';
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
  findFalconeLoading = false

  constructor(private gameService: GameService, private router: Router) { }

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

  searchFalcone() {

    const selectedPlanetsWithVehicles = this.planetsModel.filter(x => x.isSelected && x.selectedVehicle != null)
    if(selectedPlanetsWithVehicles.length != 4) {
      console.log('Choose 4 planets & vehicles to search')
    } else {
      this.findFalconeLoading = true;
      this.gameService.getToken().subscribe(res => {
        const query: FindFalconeRequest = {
          token: res.token,
          planet_names: selectedPlanetsWithVehicles.map(x => x.name),
          vehicle_names: selectedPlanetsWithVehicles.map(x => x.selectedVehicle.name)
        }
        this.gameService.findFalcone(query).subscribe(res => {
          console.log(res);
          this.findFalconeLoading = false;
          this.router.navigate(['/result']);

        }, err => {
          console.log(err);
        })
      }, err => {

      })
    }
  }
}
