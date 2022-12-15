import { Component, Input, OnInit } from '@angular/core'
import { PokemonMoveListRowComponent } from '../pokemon-move-list-row/pokemon-move-list-row.component';

@Component({
  selector: 'app-pokemon-move-list',
  templateUrl: './pokemon-move-list.component.html',
  styleUrls: ['./pokemon-move-list.component.css']
})
export class PokemonMoveListComponent implements OnInit {
	@Input() moves: Array<any> = new Array<any>();
	constructor() { }

	ngOnInit(): void {
	}

}
