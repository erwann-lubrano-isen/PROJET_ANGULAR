import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.component.html',
  styleUrls: ['./pokemon-stats.component.css']
})
export class PokemonStatsComponent implements OnInit {
@Input() stats: Array<any>=new Array<any>();
  constructor() { }

  ngOnInit(): void {
  }

}
