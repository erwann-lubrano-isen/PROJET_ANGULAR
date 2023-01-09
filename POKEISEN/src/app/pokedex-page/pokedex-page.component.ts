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
	limit : number = 15;
	
	filters = {
		"gen" : 0,
		"name" : ""
	};
	
	canload = true;
	
	pokemons : Array <any> = new Array <any>();
  constructor(private dataService : DataService, private route: ActivatedRoute) {

    this.sub = this.dataService.getSubject().subscribe(
		(id : any) => {
			for(let p of this.pokemons){
				if(p.id === id)return;
			}
			let pokemon = this.dataService.getPokemonById(id);
			if((this.filters.name.length === 0 || pokemon.fullname.toLowerCase().startsWith(this.filters.name)) 
				&& (this.filters.gen === 0 && (pokemon.id <= this.offsets[this.filters.gen] || this.filters.name.length !== 0) || pokemon.gen === this.filters.gen) 
				){
				this.pokemons.push(pokemon);
				this.pokemons = this.pokemons.sort((p1 : any, p2 : any) => {
					return p1.id - p2.id;
				}).slice(0, this.offsets[this.filters.gen]);
				this.canload=true;
			}
			/*if(this.filters.gen === 0 && this.pokemons.length < this.pokemons[this.pokemons.length-1].id){
				this.pokemons= this.pokemons.filter(
					(p : any) => {
						if(this.filters.name.length > 0)return p.fullname.toLowerCase().startsWith(this.filters.name);
						return this.pokemons.length-1 >= p.id;
					});
			}
			console.log(this.pokemons);*/

		}
    );
	

   }

	ngOnInit(): void {
		//this.offsets[this.filters.gen] = this.offsets[this.filters.gen] + this.limit;
		this.offsets[this.filters.gen] = this.limit;
		this.dataService.loadListPokemon(0, this.limit,this.filters.gen);
	}
  
    @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.filters.name.length===0) {
		if(!this.canload)return;
		this.canload=false;
		const gen = this.filters.gen;
		const offset = this.offsets[gen];
		this.offsets[gen] += this.limit;
		this.dataService.loadListPokemon(offset, this.limit, gen);
		console.count("chargement");
		
    }
  }
  
  setGen(value : number){
	  if(typeof(value) !== typeof(this.filters.gen))return;
	  this.filters.gen = value;
	  while(this.offsets.length <= this.filters.gen)this.offsets.push(this.limit);
	  this.pokemons = this.pokemons.filter(
			(pokemon : any) => {
				return (this.filters.gen === 0 || pokemon.gen === this.filters.gen)&& pokemon.fullname.toLowerCase().startsWith(this.filters.name);
			}
		);
		
		
		//this.offsets[this.filters.gen] = this.offsets[this.filters.gen] + this.limit;
		if(this.filters.name.length === 0)this.dataService.loadListPokemon(0, this.limit + this.offsets[this.filters.gen], this.filters.gen);
		else this.dataService.loadPokemonsByName(this.filters.name);
		//console.log(this.pokemons);
  
  }
  
  setNameFilter(value : string){
	  console.log(value);
	  if(typeof(value) !== typeof(this.filters.name)){
		  if(value==="")this.filters.name="";
		  return;
	  }
	  this.filters.name=value;
	  
	  this.pokemons = this.pokemons.filter(
			(pokemon : any) => {
				return (this.filters.gen == 0 || pokemon.gen == this.filters.gen) && pokemon.fullname.toLowerCase().startsWith(this.filters.name);
			}
		);
		
		if(value.length !== 0)this.dataService.loadPokemonsByName(value);
		else this.dataService.loadListPokemon(0, this.limit + this.offsets[this.filters.gen], this.filters.gen);
  }



}
