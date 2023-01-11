import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Subject , interval, map, filter, take, range, of, from } from 'rxjs';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gen-selector',
  templateUrl: './gen-selector.component.html',
  styleUrls: ['./gen-selector.component.css']
})
export class GenSelectorComponent implements OnInit {
	@Output() change = new EventEmitter<number>();
	choices : Array<any> = new Array<any>;
	sub : any;
	value :any = 0;
	
	constructor(private dataService : DataService) {
		this.choices = this.dataService.getGenList();
		this.sub = this.dataService.getGenSubject().subscribe(
		  (val : number) => {
			this.choices = this.dataService.getGenList();
			this.sub.unsubscribe();
		  }
		);
	}

	ngOnInit(): void {
	}
	
	onChange(num : string) {
		this.change.emit(parseInt(num));
	}
}
