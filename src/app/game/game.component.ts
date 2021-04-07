import { Component, OnDestroy, OnInit } from '@angular/core';
import { FindFalconeRequest, Planets, PlanetsViewModel, Vehicles } from '../typings/falcone';
import { GameService } from './game.service';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SnackbarService } from '../services/snackbar/snackbar.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  planetList: Planets[] = [];
  vehicles: Vehicles[] = [];

  planetsModel: PlanetsViewModel[] = [];
  remainingVehicles: Vehicles[] = [];
  overAllTimeTaken = 0;
  findFalconeLoading = false;

  destroy$ = new Subject<void>();

  constructor(private gameService: GameService, private router: Router, private snackBarService: SnackbarService) {
    this.gameService.reset$.pipe(takeUntil(this.destroy$)).subscribe(x => {
      if (x) this.setDefaultData();
    })
  }

  ngOnInit(): void {
    this.getPlanets();
    this.getVehicles();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  setDefaultData() {
    this.planetsModel = this.gameService.cloneObject(this.planetList);
    this.remainingVehicles = this.gameService.cloneObject(this.vehicles);
    this.overAllTimeTaken = 0;
    this.snackBarService.openSnackBar('Reset done successfully.', false);
  }

  getPlanets() {
    this.gameService.getPlanets().subscribe(res => {
      this.planetList = res;
      this.planetsModel = this.gameService.cloneObject(res);
    }, err => {
      this.snackBarService.openSnackBar('Something went wrong!', true);
    })
  }

  getVehicles() {
    this.gameService.getVehicles().subscribe(res => {
      this.vehicles = res;
      this.remainingVehicles = this.gameService.cloneObject(res);
    }, err => {
      this.snackBarService.openSnackBar('Something went wrong!', true);
    })
  }

  onPlanetSelect(planet: PlanetsViewModel) {
    const selectedPlanets = this.planetsModel.filter(x => x.isSelected);
    if (planet.isSelected || selectedPlanets.length < 4)
      planet.isSelected = !planet.isSelected;
    else
      this.snackBarService.openSnackBar('Only 4 planets can be selected', true);
  }

  onVehicleSelection(e: MatSelectChange, planet: PlanetsViewModel) {
    const vehicle = e.value as Vehicles;
    if (this.canAssignVehicleToPlanet(planet, vehicle)) {
      this.updateRemainingVehicles(vehicle, planet.selectedVehicle);
      planet.selectedVehicle = vehicle;
      planet.timeTaken = planet.distance / vehicle.speed;
      this.overAllTimeTaken = this.planetsModel.reduce((a, c) => a += c.timeTaken ? c.timeTaken : 0, 0);
    } else {
      this.snackBarService.openSnackBar('Selected vehicle cannot travel this distance', true);
      planet.selectedVehicle = null;
    }

  }

  canAssignVehicleToPlanet(planet: PlanetsViewModel, vehicle: Vehicles) {
    return vehicle.max_distance >= planet.distance;
  }

  updateRemainingVehicles(selectedVehicle: Vehicles, prevVehicle: Vehicles) {
    for (let i = 0; i < this.remainingVehicles.length; i++) {
      const vehicle = this.remainingVehicles[i];
      if (vehicle.name === selectedVehicle.name) {
        if (vehicle.total_no > 0) vehicle.total_no -= 1;
      }
      if (prevVehicle && vehicle.name === prevVehicle.name) {
        vehicle.total_no += 1;
      }
    }
  }

  searchFalcone() {

    const selectedPlanetsWithVehicles = this.planetsModel.filter(x => x.isSelected && x.selectedVehicle != null)
    if (selectedPlanetsWithVehicles.length !== 4) {
      this.snackBarService.openSnackBar('Please select 4 planets with vehicles to search', true);
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
          if (res.status === 'success' || res.status === 'false') {
            this.gameService.falconeSearchResult = res;
            this.router.navigate(['/result']);
          } else {
            console.log(res.error);
          }

        }, err => {
          console.log(err);
        })
      }, err => {

      })
    }
  }
}
