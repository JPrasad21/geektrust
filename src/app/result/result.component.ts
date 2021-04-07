import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game/game.service';
import { FindFalconeResponse } from '../typings/falcone';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  falconeSearchResult: FindFalconeResponse;
  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit(): void {
    this.falconeSearchResult = this.gameService.falconeSearchResult;
    if (!this.falconeSearchResult) this.restart();
  }

  restart() {
    this.router.navigate(['/']);
  }

}
