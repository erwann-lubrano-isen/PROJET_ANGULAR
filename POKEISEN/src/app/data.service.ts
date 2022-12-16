import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject , interval, map, filter, take, range, of, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
	httpClient : HttpClient;
	listPokemon : Array<any> = new Array<any>;
	pokemons : Array<any> = new Array<any>;
	
	subject = new Subject();
	
	constructor(httpClient : HttpClient){
		this.httpClient =httpClient;
		//this.updateListPokemon(0,20);
	}
	
	getSubject() {
		return this.subject;
	}
	
	getListPokemon() {
		return this.listPokemon;
	}
	
	getPokemons() {
		return this.pokemons.sort(
			(a : any , b : any)  =>  {
				return a.id - b.id;
			}
		);
	}
	
	getPokemon(name : string) : any {
		let p = this.pokemons.filter((p : any) => {
			return (p.name ===  name);
		});
		if(p.length == 0)return null;
		else return p[0];
	}
	
	getPokemonNameById(id : number) : string {
		for(let p of this.pokemons){
			if(p.id === id)
				return p.name;
		}
		return "";
	}
	
	updateListPokemon(offset : number, limit : number){
		let url = 'https://pokeapi.co/api/v2/pokemon?offset='+offset+"&limit="+limit;
		/*this.httpClient.get(url).pipe(map(response => response.data),filter(data => data.status === 'success')
		);*/
		this.httpClient.get(url).subscribe(
			(pokemons : any) => {
				this.listPokemon = pokemons.results;
				for(let p of pokemons.results)
					this.updatePokemon(p.url, p.name);
				//console.log(this.listPokemon);
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
				this.subject.next(pokemon.id);
				console.log(pokemon);
			}
		)
	}
	
	loadListPokemon(offset : number, limit : number){
		
		if(this.pokemons.filter(
			(pokemon) => {
				return offset <= pokemon.id && offset + limit > pokemon.id;
			}
		).length >= limit){
			this.subject.next(offset+1);
		}else{
			this.updateListPokemon(offset, limit);
		}
		
	}
	
	getPokemonIdByUrl(url : string) : number{
		return parseInt(url.substring("https://pokeapi.co/api/v2/pokemon/".length,url.length-1));
	}
}
