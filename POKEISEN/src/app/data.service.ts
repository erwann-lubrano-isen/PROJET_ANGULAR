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
	listNames : Array<any> = new Array<any>;
	
	subject = new Subject();
	subjectGen = new Subject();
	genList : Array<any> = new Array<any>; 
	
	constructor(httpClient : HttpClient){
		this.httpClient =httpClient;
		this.loadGenList();
		this.loadNames();
	}
	
	getSubject() {
		return this.subject;
	}
	
	getListPokemon() {
		return this.listPokemon;
	}
	
	getPokemons(gen : number=0, cnt : number=25, name="") {
		if(name.length === 0)
			return this.pokemons.filter(
				(pokemon : any) => {
					return (gen == 0 || pokemon.gen == gen);
				}
			).sort(
				(a : any , b : any)  =>  {
					return a.id - b.id;
				}
			).slice(0,cnt);
		return this.pokemons.filter(
				(pokemon : any) => {
					return (gen == 0 || pokemon.gen == gen) && pokemon.fullname.startsWith(name);
				}
			).sort(
				(a : any , b : any)  =>  {
					return a.id - b.id;
				}
			) 
	}
	
	getPokemon(name : string) : any {
		let p = this.pokemons.filter((p : any) => {
			return (p.fullname ===  name);
		});
		if(p.length == 0)return null;
		else return p[0];
	}
	
	getPokemonById(id : number) : any {
		let p = this.pokemons.filter((p : any) => {
			return (p.id ===  id);
		});
		if(p.length == 0)return null;
		else return p[0];
	}
	
	getPokemonNameById(id : number) : string {
		for(let p of this.pokemons){
			if(p.id === id)
				return p.fullname;
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
						this.updatePokemon(p.url);
				}
			)
		}else{
			let url = 'https://pokeapi.co/api/v2/generation/'+gen; //il n'y a pas de pagination pour les generations
			this.httpClient.get(url).subscribe(
				(pokemons : any) => {
					this.listPokemon = pokemons.pokemon_species.sort(
						(p1 : any, p2 : any) => {
							const urlSp = "https://pokeapi.co/api/v2/pokemon-species/"
							const p1Id = parseInt(p1.url.substring(urlSp.length, p1.url.length-1));
							const p2Id = parseInt(p2.url.substring(urlSp.length, p2.url.length-1));
							return p1Id - p2Id;
						}
					);
					for(let p in this.listPokemon){
						const i = parseInt(p);
						if(i - offset < 0)continue;
						if(i - offset - limit >= 0)break;
						this.listPokemon[p].url = this.listPokemon[p].url.replace(/-species/gi,"");
						this.updatePokemon(this.listPokemon[p].url);
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
	
	updatePokemon(url : string){
		const id = this.getPokemonIdByUrl(url);
		this.pokemons = this.pokemons.filter((p : any) => {
			if(p.id ===  id){
				this.subject.next(id);
				return false;
			}
			return true;
		});
		
		
		this.httpClient.get(url).subscribe(
			(pokemon : any) => {
				this.httpClient.get(pokemon.species.url).subscribe(
					(species : any) => {
						pokemon.fullname=pokemon.name;
						pokemon.name=species.name;
						pokemon.varieties = species.varieties;
						for(let i in pokemon.varieties){
							pokemon.varieties[i].pokemon.id=this.getPokemonIdByUrl(pokemon.varieties[i].pokemon.url);
						}
						pokemon.gen = this.getGenIdByName(species.generation.name);
						pokemon.text_entrie = species.flavor_text_entries.filter(
							(val : any) => {
								return val.language.name == "en";
							}
						).pop().flavor_text;
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
	
	loadPokemon(id : number){
		let url = "https://pokeapi.co/api/v2/pokemon/"+id;
		this.updatePokemon(url);
	}
	
	loadListPokemon(offset : number, limit : number, gen : number = 0){
		const listP = this.pokemons.filter(
			(pokemon) => {
				return offset <= pokemon.id && offset + limit > pokemon.id && (gen==0 || gen === pokemon.gen);
			});
		if(listP.length >= limit){
			for(let p of listP)this.subject.next(p.id);
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
				this.genList = genList.results;
				for(let i in this.genList){
					this.genList[i].id = this.getGenIdByUrl(this.genList[i].url);
				}
				this.subjectGen.next(genList.results.length);
			}
			
		)
	}
	
	loadNames(){
		let url = 'https://pokeapi.co/api/v2/pokemon?limit=-1';
		this.httpClient.get(url).subscribe(
			(pokemons : any) => {
				for(let p of pokemons.results)
					this.listNames.push({
						"name" : p.name,
						"id" : this.getPokemonIdByUrl(p.url),
						"url" : p.url
					});
			}
		)
	} 
	
	loadPokemonsByName(name : string) {
		let names = this.searchPokemonByName(name);
		let pokeList = new Array<any>;
		for(let n of names){
			const p = this.listNames.filter((val) => {return val.name===n;})[0];
			pokeList.push({
				"id" : p.id,
				"url" : p.url
			});
		}
		pokeList = pokeList.filter(
			(p : any) => {
				for(let pokemon of this.pokemons)
					if(p.id===pokemon.id){
						this.subject.next(p.id);
						return false;
					}
				return true;
			}
		);
		for(let p of pokeList)
			this.updatePokemon(p.url);
	}
	
	searchPokemonByName(name : string) : Array<string>{
		let names = new Array<string>;
		for(let n of this.listNames)
			if(n.name.toLowerCase().startsWith(name.toLowerCase()))
				names.push(n.name);
		return names;
	}
	
	
	
	getGenList() : Array<any> {
		return this.genList;
	}
	
	getGenSubject() : any {
		return this.subjectGen;
	}
}
