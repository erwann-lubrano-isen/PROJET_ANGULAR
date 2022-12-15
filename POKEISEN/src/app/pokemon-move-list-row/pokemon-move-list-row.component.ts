import { Component, OnInit, Input } from '@angular/core';
import { MovesDataService } from '../moves-data.service';

@Component({
  selector: 'app-pokemon-move-list-row',
  templateUrl: './pokemon-move-list-row.component.html',
  styleUrls: ['./pokemon-move-list-row.component.css']
})
export class PokemonMoveListRowComponent implements OnInit {
	@Input() move : any;
	
	sub : any;
	
	moveDetail : any = null;
	
	constructor(private dataService : MovesDataService) {
		this.sub = this.dataService.getSubject().subscribe(
			(val) => {
				let id = this.dataService.getMoveIdByUrl(this.move.url);
				if(val == id) {
					this.moveDetail = this.dataService.getMove(id);
				}
			}
		);
	}

	ngOnInit(): void {
		this.dataService.loadMove(this.move.url);
	}

}
