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
	
	/**
	*	@brief recupere l'observable lié à l'actualisation de la liste pokemons
	*/
	getSubject() {
		return this.subject;
	}
	
	/**
	*	@brief getter pour listPokemon
	*/
	getListPokemon() {
		return this.listPokemon;
	}
	
	/**
	*	@brief renvoie la liste des pokemons chargés
	*	@param gen : filtre par generation, 0 si getComputedStyle
	*	@param cnt : nombre de pokemon renvoyés
	*	@param name : filtre par le debut du nom
	*/
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
	
	/**
	*	@brief renvoie un pokemon
	*	@param name : nom du pokemon
	*/
	getPokemon(name : string) : any {
		let p = this.pokemons.filter((p : any) => {
			return (p.fullname ===  name);
		});
		if(p.length == 0)return null;
		else return p[0];
	}
	
	/**
	*	@brief renvoie un pokemon
	*	@param id : id du pokemon
	*/
	getPokemonById(id : number) : any {
		let p = this.pokemons.filter((p : any) => {
			return (p.id ===  id);
		});
		if(p.length == 0)return null;
		else return p[0];
	}
	
	/**
	*	@brief renvoie le nom d'un pokemon grace a son id
	*	@param id : id du pokemon
	*/
	getPokemonNameById(id : number) : string {
		for(let p of this.pokemons){
			if(p.id === id)
				return p.fullname;
		}
		return "";
	}
	
	/**
	*	@brief charge la liste des pokemons
	*	@param offset : decalage du premier pokemon à charger
	*	@param limit : nombre maximal de pokemon à charger
	*	@param gen : recherche par generation si different de 0
	*/
	updateListPokemon(offset : number, limit : number, gen : number){
		if(gen === 0){
			let url = 'https://pokeapi.co/api/v2/pokemon?offset='+offset+"&limit="+limit;
		
			
			this.httpClient.get(url).subscribe(
				(pokemons : any) => {
					this.listPokemon = pokemons.results;
					for(let p of pokemons.results)
						this.updatePokemon(this.getPokemonIdByUrl(p.url));
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
						this.updatePokemon(this.getPokemonIdByUrl(this.listPokemon[p].url));
					}
					
				}
			)
		}
	}
	
	/**
	*	@brief converti un chiffre romain en chiffre pas romain
	*	@param c : caractere romain
	*/
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
	
	/**
	*	@brief recupere le numero d'une generation a partir de son nom
	*	@param name : nom de la generation
	*/
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
	
	/**
	*	@brief charge un pokemon et le stocke dans pokemons
	*	@param id : id du pokemon  
	*/
	updatePokemon(id : number){
		
		this.pokemons = this.pokemons.filter((p : any) => {
			if(p.id ===  id){
				this.subject.next(id);
				return false;
			}
			return true;
		});
		
		const url = "https://pokeapi.co/api/v2/pokemon/"+id;
		
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
						
						this.httpClient.get(species.evolution_chain.url).subscribe(
							(evolution_chain : any) => {
								pokemon.evolution_tree = this.getEvolutionTree(evolution_chain.chain);
								
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
				);
				
			}
		)
	}
	
	/**
	*	@brief genere un arbre d'evolution tout beau tout propre à partir de la chaine d'évolution
	*	@param evolution_chain : chaine evolutive a transformer
	*/
	getEvolutionTree(evolution_chain : any) : any{
		let tree = {
			"name" : evolution_chain.species.name,
			"id" : this.getPokemonIdByUrl(evolution_chain.species.url,"https://pokeapi.co/api/v2/pokemon-species/"),
			"evolutions" : new Array<any>()
		};
		for(let ec of evolution_chain.evolves_to){
			tree.evolutions.push(this.getEvolutionTree(ec));
		}
		return tree;
	}
	
	/**
	*	@brief charge un pokemon
	*	@param id: id du pokemon
	*/
	loadPokemon(id : number){;
		this.updatePokemon(id);
	}
	
	/**
	*	@brief cree la liste des pokemons a charger
	*	@param offset : decalage du premier pokemon à charger
	*	@param limit : nombre maximal de pokemon à charger
	*	@param gen : recherche par generation si different de 0
	*/
	loadListPokemon(offset : number, limit : number, gen : number = 0){
		const listP = this.pokemons.filter(
			(pokemon) => {
				return offset <= pokemon.id && offset + limit > pokemon.id && (gen===0 || gen === pokemon.gen);
			});
		if(listP.length >= limit){
			for(let p of listP)this.subject.next(p.id);
		}else{
			this.updateListPokemon(offset, limit, gen);
		}
		
	}
	
	/**
	*	@brief parse l'id d'un pokemon à partir de son URL
	*	@param url : url du pokemon
	*	@param url2 : base de l'url
	*/
	getPokemonIdByUrl(url : string, url2 : string = "https://pokeapi.co/api/v2/pokemon/") : number{
		return parseInt(url.substring(url2.length,url.length-1));
	}
	
	/**
	*	@brief parse l'id d'une generation à partir de son URL
	*	@param url : url de la generation
	*/
	getGenIdByUrl(url : string) : number{
		return parseInt(url.substring("https://pokeapi.co/api/v2/generation/".length,url.length-1));
	}
	
	/**
	*	@brief charge la liste des générations
	*/
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
	
	/**
	*	@brief charge la liste des noms des pokemons
	*/
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
	
	/**
	*	@brief charge les pokemons par nom
	*	@param name : début du nom des pokemons
	*/
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
			this.updatePokemon(this.getPokemonIdByUrl(p.url));
	}
	
	/**
	*	@brief liste le nom des pokemons par nom
	*	@param name : début du nom des pokemons
	*/
	searchPokemonByName(name : string) : Array<string>{
		let names = new Array<string>;
		for(let n of this.listNames)
			if(n.name.toLowerCase().startsWith(name.toLowerCase()))
				names.push(n.name);
		return names;
	}
	
	
	/**
	*	@brief recupère la liste des generations
	*/
	getGenList() : Array<any> {
		return this.genList;
	}
	
	/**
	*	@brief recupère l'observable sur la liste des generations
	*/
	getGenSubject() : any {
		return this.subjectGen;
	}
}
