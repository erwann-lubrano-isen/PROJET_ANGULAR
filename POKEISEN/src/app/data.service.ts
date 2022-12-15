import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, map, filter, take, range, of, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
	httpClient : HttpClient;
	listPokemon : Array<any> = new Array<any>;
	pokemons : Array<any> = new Array<any>;
	
	constructor(httpClient : HttpClient){
		this.httpClient =httpClient;
		this.updateListPokemon();
	}

	getListPokemon() {
		return this.listPokemon;
	}
	
	getPokemons() {
		return this.pokemons;
	}
	
	updateListPokemon(){
		let url = 'https://pokeapi.co/api/v2/pokemon';
		/*this.httpClient.get(url).pipe(map(response => response.data),filter(data => data.status === 'success')
		);*/
		this.httpClient.get(url).subscribe(
			(pokemons : any) => {
				this.listPokemon = pokemons;
				for(let p of pokemons.results)
					this.updatePokemon(p.url, p.name);
				console.log(this.listPokemon);
			}
		)
	}
	
	updatePokemon(url : string, name : string){
		/*this.httpClient.get(url).pipe(map(response => response.data),filter(data => data.status === 'success')
		);*/
		this.pokemons = this.pokemons.filter((p : any) => {
			return !(p.name ===  name);
		});
		
		this.httpClient.get(url).subscribe(
			(pokemon : any) => {
				this.pokemons.push(pokemon);
				console.log(this.pokemons);
			}
		)
	}
}
