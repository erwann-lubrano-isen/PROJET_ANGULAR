import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject , interval, map, filter, take, range, of, from } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MovesDataService {
	listMove : Array<any> = new Array<any>();
	subject = new Subject();

	constructor(private httpClient : HttpClient) {
		
	}
	
	/**
	*	@brief recupere l'observable
	*/
	getSubject() {
		return this.subject;
	}
	
	/**
	*	@brief charge une capacité
	*	@param url : url de la capacité
	*/
	loadMove(url : string) {
		let id = this.getMoveIdByUrl(url);
		if(this.listMove.filter(
			(move : any) => {
				return move.id === id;
			}
		).length === 0) {
			this.httpClient.get(url).subscribe(
				(move : any) => {
					this.listMove.push(move);
					this.subject.next(id);
				}
			)
		}else{
			this.subject.next(id);
		}
	}
	
	/**
	*	@brief recupère une capacité
	*	@param id : id de la capacité
	*/
	getMove(id : number){
		let mvs = this.listMove.filter(
			(move : any) => {
				return move.id === id;
			}
		)
		return mvs.length > 0 ? mvs[0] : null;
	}
	
	/**
	*	@brief recupère l'id d'une capacité grace à son url
	*	@param url : url de la capacité
	*/
	getMoveIdByUrl(url : string) : number{
		return parseInt(url.substring("https://pokeapi.co/api/v2/move/".length,url.length-1));
	}
}
