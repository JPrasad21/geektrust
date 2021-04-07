import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private gameService: GameService, public router: Router) { }

  ngOnInit(): void {
  }

  resetData() {
    this.gameService.reset$.next(true);
  }
}
