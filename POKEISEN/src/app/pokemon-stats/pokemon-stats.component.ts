import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.component.html',
  styleUrls: ['./pokemon-stats.component.css']
})
export class PokemonStatsComponent implements OnInit {
	@Input() stats: Array<any>=new Array<any>();
	
	formated_stats = {
		hp : {
			value : 0,
			width : 0,
			color : "#ff0000"
		},
		att : {
			value : 0,
			width : 0,
			color : "#ff0000"
		},
		def : {
			value : 0,
			width : 0,
			color : "#ff0000"
		},
		spA : {
			value : 0,
			width : 0,
			color : "#ff0000"
		},
		spD : {
			value : 0,
			width : 0,
			color : "#ff0000"
		},
		spe : {
			value : 90,
			width : 10,
			color : "#ff0000"
		}
	};
	
	constructor() {
		
	}

	ngOnInit(): void {
		this.update();
	}
	
	update(newStats=null){
		if(newStats!==null)this.stats=newStats;
		this.formated_stats.hp.value = this.stats[0].base_stat;
		this.formated_stats.att.value = this.stats[1].base_stat;
		this.formated_stats.def.value = this.stats[2].base_stat;
		this.formated_stats.spA.value = this.stats[3].base_stat;
		this.formated_stats.spD.value = this.stats[4].base_stat;
		this.formated_stats.spe.value = this.stats[5].base_stat;
		
		this.formated_stats.hp.color = this.selectColor(this.formated_stats.hp.value);
		this.formated_stats.att.color = this.selectColor(this.formated_stats.att.value);
		this.formated_stats.def.color = this.selectColor(this.formated_stats.def.value);
		this.formated_stats.spA.color = this.selectColor(this.formated_stats.spA.value);
		this.formated_stats.spD.color = this.selectColor(this.formated_stats.spD.value);
		this.formated_stats.spe.color = this.selectColor(this.formated_stats.spe.value);
		
		this.formated_stats.hp.width = this.formated_stats.hp.value*100/255;
		this.formated_stats.att.width = this.formated_stats.att.value*100/255;
		this.formated_stats.def.width = this.formated_stats.def.value*100/255;
		this.formated_stats.spA.width = this.formated_stats.spA.value*100/255;
		this.formated_stats.spD.width = this.formated_stats.spD.value*100/255;
		this.formated_stats.spe.width = this.formated_stats.spe.value*100/255;
	}
	
	selectColor(value : number) : string {
		if(value < 60)return "#ff0000";
		else if(value <= 100)return "rgb(255,"+(value-60)*255/40+",0)";
		else if(value <= 140)return "rgb("+(255-(value-100)*255/40)+",255,0)";
		else if(value <= 180)return "rgb(0,255,"+(value-140)*255/40+")";
		else if(value <= 220)return "rgb(0,"+(255-(value-180)*255/40)+",255)";
		else return "rgb(0,0,255)";
	}

}
