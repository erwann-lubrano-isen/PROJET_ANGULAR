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
	subjectGen = new Subject();
	genList : Array<any> = new Array<any>; 
	
	constructor(httpClient : HttpClient){
		this.httpClient =httpClient;
		this.loadGenList();
	}
	
	getSubject() {
		return this.subject;
	}
	
	getListPokemon() {
		return this.listPokemon;
	}
	
	getPokemons(gen : number=0, cnt : number=25) {
		//console.log(this.pokemons);
		return this.pokemons.filter(
			(pokemon : any) => {
				return gen == 0 || pokemon.gen == gen;
			}
		).sort(
			(a : any , b : any)  =>  {
				return a.id - b.id;
			}
		).slice(0,cnt);
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
	
	updateListPokemon(offset : number, limit : number, gen : number){
		if(gen === 0){
			let url = 'https://pokeapi.co/api/v2/pokemon?offset='+offset+"&limit="+limit;
		
			
			this.httpClient.get(url).subscribe(
				(pokemons : any) => {
					this.listPokemon = pokemons.results;
					for(let p of pokemons.results)
						this.updatePokemon(p.url, p.name);
					//console.log(this.listPokemon);
				}
			)
		}else{
			let url = 'https://pokeapi.co/api/v2/generation/'+gen+'/?offset='+offset+"&limit="+limit;
			console.log(url);
			/*this.httpClient.get(url).pipe(map(response => response.data),filter(data => data.status === 'success')
			);*/
			this.httpClient.get(url).subscribe(
				(pokemons : any) => {
					console.log(pokemons);
					this.listPokemon = pokemons.pokemon_species;
					for(let p in this.listPokemon){
						this.listPokemon[p].url = this.listPokemon[p].url.replace(/-species/gi,"");
						this.updatePokemon(this.listPokemon[p].url, this.listPokemon[p].url.name);
					}
					
				}
			)
		}
	}
	
	genNumByRChar(c : string) : number{
		if(c.length < 1)return 0;
		let equNum = [
			{ 
				r : "i", 
				n : 1
			},
			{
				r : "v",
				n : 5
			},
			{
				r : "x",
				n : 10
			},
			{
				r : "l",
				n : 50
			},
			{
				r : "c",
				n :	100
			}
		];
		
		for(let n of equNum){
			if(n.r[0] == c[0])return n.n;
		}
		return 0;
	}
	
	getGenIdByName(name : string) : number {
		let rNum = name.substring("generation-".length,name.length);
		//console.log(rNum);
		if(rNum.length < 1)return 0;
		else if(rNum.length === 1)return this.genNumByRChar(rNum);
		let pre = this.genNumByRChar(rNum[0]);
		let tot = pre;
		for(let i = 1; i < rNum.length; i++){
			let cur = this.genNumByRChar(rNum[i]);
			if(pre < cur){
				tot = cur - tot;
			}else{
				tot += cur;
			}
			pre = cur;
		}
		return tot;
	}
	
	updatePokemon(url : string, name : string){
		/*this.httpClient.get(url).pipe(map(response => response.data),filter(data => data.status === 'success')
		);*/
		this.pokemons = this.pokemons.filter((p : any) => {
			return !(p.name ===  name);
		});
		
		
		this.httpClient.get(url).subscribe(
			(pokemon : any) => {
				/*for(let p in this.pokemons)
					if(this.pokemons[p].id === pokemon.id)return;*/
				this.httpClient.get(url.replace(/pokemon/gi,"pokemon-species")).subscribe(
					(species : any) => {
						pokemon.name=species.name;
						pokemon.gen = this.getGenIdByName(species.generation.name);
						pokemon.text_entrie = species.flavor_text_entries.filter(
							(val : any) => {
								return val.language.name = "en";
							}
						)[0].flavor_text;
						this.pokemons = this.pokemons.filter(
							(p : any) => {
								return p.id !== pokemon.id;
							}
						);
						this.pokemons.push(pokemon);
						this.subject.next(pokemon.id);
					}
				);
				
			}
		)
	}
	
	loadListPokemon(offset : number, limit : number, gen : number = 0){
		
		if(this.pokemons.filter(
			(pokemon) => {
				return offset <= pokemon.id && offset + limit > pokemon.id && (gen==0 || gen === pokemon.gen);
			}
		).length >= limit){
			this.subject.next(offset+1);
		}else{
			this.updateListPokemon(offset, limit, gen);
		}
		
	}
	
	getPokemonIdByUrl(url : string) : number{
		return parseInt(url.substring("https://pokeapi.co/api/v2/pokemon/".length,url.length-1));
	}
	
	getGenIdByUrl(url : string) : number{
		return parseInt(url.substring("https://pokeapi.co/api/v2/generation/".length,url.length-1));
	}
	
	loadGenList() : void {
		let url = "https://pokeapi.co/api/v2/generation";
		this.httpClient.get(url).subscribe(
			(genList : any) => {
				this.genList = genList.results
				for(let i in this.genList){
					this.genList[i].id = this.getGenIdByUrl(this.genList[i].url);
				}
				this.subjectGen.next(genList.results.length);
			}
			
		)
	}
	
	getGenList() : Array<any> {
		return this.genList;
	}
	
	getGenSubject() : any {
		return this.subjectGen;
	}
}
