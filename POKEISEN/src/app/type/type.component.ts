import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {
	@Input() types : any;

	colors_type = [
		{
			name : "grass",
			color : "rgb(120, 200, 80)"
		},
		{
			name : "bug",
			color : "rgb(168, 184, 32)"
		},
		{
			name : "dark",
			color : "rgb(112, 88, 72)"
		},
		{
			name : "dragon",
			color : "rgb(112, 56, 248)"
		},
		{
			name : "electric",
			color : "rgb(248, 208, 48)"
		},
		{
			name : "fairy",
			color : "rgb(249, 140, 255)"
		},
		{
			name : "fighting",
			color : "rgb(192, 48, 40)"
		},
		{
			name : "fire",
			color : "rgb(240, 128, 48)"
		},
		{
			name : "flying",
			color : "rgb(168, 144, 240)"
		},
		{
			name : "ghost",
			color : "rgb(112, 88, 152)"
		},
		{
			name : "ground",
			color : "rgb(224, 192, 104)"
		},
		{
			name : "ice",
			color: "rgb(152, 216, 216)"
		},
		{
			name : "normal",
			color : "rgb(168, 168, 120)"
		},
		{
			name : "poison",
			color : "rgb(160, 64, 160)"
		},
		{
			name : "psychic",
			color : "rgb(248, 88, 136)"
		},
		{
			name : "rock",
			color : "rgb(184, 160, 56)"
		},
		{
			name : "steel",
			color : "rgb(184, 184, 208)"
		},
		{
			name : "water",
			color : "rgb(104, 144, 240)"
		}
	];

	formated_types = new Array<any>();



  constructor() {

  }
  
  update(newTypes=null){
	  if(newTypes!==null)this.types=newTypes;
	  this.formated_types = new Array<any>();
	  for(let t of this.types){
		  for(let it of this.colors_type){
			  if(it.name == t.type.name)this.formated_types.push(it);
		  }
	  }
  }

  ngOnInit(): void {
	  this.update();
  }

}
