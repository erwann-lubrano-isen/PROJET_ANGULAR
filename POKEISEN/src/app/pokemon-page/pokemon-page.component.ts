import { Component, OnInit, Directive, Input, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { PokemonMoveListComponent } from '../pokemon-move-list/pokemon-move-list.component';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';
import { TypeComponent } from '../type/type.component';

@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.css']
})
export class PokemonPageComponent implements OnInit {
	id : number = 0;
	pokemon : any = null;
	
	statsCmp : any = null;
    @ViewChild(PokemonStatsComponent) set apppokemonstats(s: PokemonStatsComponent) {
		this.statsCmp = s;
	};
	
	typeCmp : any = null;
    @ViewChild(TypeComponent) set apptype(t: TypeComponent) {
		this.typeCmp = t;
	};
	
	sub : any;

	constructor(private route: ActivatedRoute,
				private router: Router,
				private dataService: DataService) { 
	window.scroll({ 
      top: 0, 
      left: 0
    });
		
	
		
	}

	ngOnInit(): void {
		this.sub = this.dataService.getSubject().subscribe(
			(val) => {
				this.updateData();
			}
		);
		this.route.paramMap.subscribe(
            (params) => {
				this.id = parseInt(params.get('id') ?? "0");
				this.dataService.loadPokemon(this.id);
			}
        );
	}
	
	ngOnDestroy(){
		this.sub.unsubscribe();
	}
	
	updateData() : void {
		this.pokemon = this.dataService.getPokemon(this.dataService.getPokemonNameById(this.id));
		console.log(this.pokemon);
		if(this.statsCmp !== undefined)this.statsCmp.update(this.pokemon.stats);
		if(this.typeCmp !== undefined)this.typeCmp.update(this.pokemon.types);
	}

}
