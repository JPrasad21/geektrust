import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  planets: any[] = [];
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.getPlanets();
  }

  getPlanets() {
  this.gameService.getPlanets().subscribe(res => {
    this.planets = res as any;
  }, err => {
    console.log(err);
  })
}

}
