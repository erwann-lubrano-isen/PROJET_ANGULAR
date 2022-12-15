import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
@Component({
  selector: 'app-pokedex-page',
  templateUrl: './pokedex-page.component.html',
  styleUrls: ['./pokedex-page.component.css']
})
export class PokedexPageComponent implements OnInit {

  sub : any ;
  pokemons : Array <any> = new Array <any>();
  constructor(private dataService : DataService) {
    this.sub = this.dataService.getSubject().subscribe(
      (val) => {
        this.pokemons = this.dataService.getPokemons();

      }
    );

   }

  ngOnInit(): void {
	  this.dataService.loadListPokemon(0, 20);
  }



}
