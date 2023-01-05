import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject , interval, map, filter, take, range, of, from } from 'rxjs';

@Component({
  selector: 'app-pokedex-page',
  templateUrl: './pokedex-page.component.html',
  styleUrls: ['./pokedex-page.component.css']
})
export class PokedexPageComponent implements OnInit {
	sub : any;
	offsets = [
		 0
	];
	limit : number = 25;
	
	filters = {
		"gen" : 0
	};
	
	pokemons : Array <any> = new Array <any>();
  constructor(private dataService : DataService, private route: ActivatedRoute) {

    this.sub = this.dataService.getSubject().subscribe(
      (val) => {
        this.pokemons = this.dataService.getPokemons(this.filters.gen, this.offsets[this.filters.gen]);
		if(this.filters.gen === 0 && this.pokemons.length < this.pokemons[this.pokemons.length-1].id){
			this.pokemons= this.pokemons.filter(
				(p : any) => {
					return this.pokemons.length-1 >= p.id;
				});
		}
		console.log(this.pokemons);

      }
    );
	

   }

  ngOnInit(): void {
		this.dataService.loadListPokemon(this.offsets[this.filters.gen], this.limit,this.filters.gen);
		this.offsets[this.filters.gen] = this.offsets[this.filters.gen] + this.limit;
  }
  
    @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		
      this.dataService.loadListPokemon(this.offsets[this.filters.gen], this.limit, this.filters.gen);
	  this.offsets[this.filters.gen] = this.offsets[this.filters.gen] + this.limit;
    }
  }
  
  setGen(value : number){
	  if(typeof(value) !== typeof(this.filters.gen))return;
	  this.filters.gen = value;
	  while(this.offsets.length <= value)this.offsets.push(0);
	  this.pokemons = this.pokemons.filter(
			(pokemon : any) => {
				console.log(this.filters.gen);
				return (this.filters.gen == 0 || pokemon.gen == this.filters.gen);
			}
		);
		
		
		this.offsets[this.filters.gen] = this.offsets[this.filters.gen] + this.limit;
		this.dataService.loadListPokemon(this.offsets[this.filters.gen], this.limit, this.filters.gen);
		//console.log(this.pokemons);
  
  }



}
