import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { DataService } from '../data.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pokemon-search-bar',
  templateUrl: './pokemon-search-bar.component.html',
  styleUrls: ['./pokemon-search-bar.component.css']
})
export class PokemonSearchBarComponent implements OnInit {
	@Output() nameFilter = new EventEmitter<string>();
	searchForm : UntypedFormGroup;
	searchField = new FormControl<string>("", { nonNullable : true });
	listName = new Array<string>;
	constructor(private dataService : DataService) {
		this.searchForm = new UntypedFormGroup({
			searchField : this.searchField
		});
	}

	ngOnInit(): void {
	}
	
	submit() {
		this.nameFilter.emit(this.searchField.value);
	}
	
	change() {
		this.listName = this.dataService.searchPokemonByName(this.searchField.value);
	}

}
