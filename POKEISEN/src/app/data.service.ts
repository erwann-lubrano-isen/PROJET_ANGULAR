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
}
