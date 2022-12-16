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
	offset : number = 0;
	limit : number = 50;
	
	pokemons : Array <any> = new Array <any>();
  constructor(private dataService : DataService, private route: ActivatedRoute) {
		/*this.route.queryParamMap
			.subscribe((params) => {
				let parameters : any = { ...params  };
				if(parameters.params !== undefined){
					if(parameters.params.offset !== undefined){
						this.offset = parseInt(parameters.params.offset);
					}
					if(parameters.params.limit !== undefined){
						this.limit = parseInt(parameters.params.limit);
					}
				}
				this.dataService.loadListPokemon(this.offset, this.limit);
			}
		);*/

    this.sub = this.dataService.getSubject().subscribe(
      (val) => {
        this.pokemons = this.dataService.getPokemons();

      }
    );
	

   }

  ngOnInit(): void {
	  this.dataService.loadListPokemon(this.offset, this.limit);
  }
  
    @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		this.offset = this.offset + this.limit;
		this.limit = 25;
      this.dataService.loadListPokemon(this.offset, this.limit);
    }
  }



}
