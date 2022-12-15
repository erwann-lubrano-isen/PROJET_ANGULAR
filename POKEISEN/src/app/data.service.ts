import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, map, filter, take, range, of, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
	httpClient : HttpClient;
	
	constructor(httpClient : HttpClient){
		this.httpClient =httpClient;
	}

	getPokemon() {
		const url = 'https://pokeapi.co/api/v2/pokemon';
		return this.httpClient.get(url).pipe(map(response => response.data),filter(data => data.status === 'success')
		);
	}
}
