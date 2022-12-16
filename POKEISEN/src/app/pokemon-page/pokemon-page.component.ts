import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PokemonMoveListComponent } from '../pokemon-move-list/pokemon-move-list.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';
@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.css']
})
export class PokemonPageComponent implements OnInit {
	id : number = 0;
	pokemon : any = null;
	
	sub : any;

	constructor(private route: ActivatedRoute,
				private router: Router,
				private dataService: DataService) { 
	window.scroll({ 
      top: 0, 
      left: 0
    });
		
	this.route.paramMap.subscribe(
            (params) => {
				this.id = parseInt(params.get('id') ?? "0");
				
				this.sub = this.dataService.getSubject().subscribe(
					(val) => {
						if(val == this.id)this.updateData();
					}
				);
				
				this.dataService.loadListPokemon(this.id-1, 1);
			}
        );
		
	}

	ngOnInit(): void {
		
	}
	
	ngOnDestroy(){
		this.sub.unsubscribe();
	}
	
	updateData() : void {
		this.pokemon = this.dataService.getPokemon(this.dataService.getPokemonNameById(this.id));
		console.log(this.pokemon);
	}

}
