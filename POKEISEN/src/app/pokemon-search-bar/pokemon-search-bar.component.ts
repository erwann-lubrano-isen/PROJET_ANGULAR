import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-search-bar',
  templateUrl: './pokemon-search-bar.component.html',
  styleUrls: ['./pokemon-search-bar.component.css']
})
export class PokemonSearchBarComponent implements OnInit {
  name = 'search'
  constructor() { }

  ngOnInit(): void {
  }

}
