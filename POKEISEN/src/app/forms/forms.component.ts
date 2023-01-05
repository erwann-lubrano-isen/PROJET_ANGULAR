import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {

  @Input() forms : any;
  formated_forms = new Array<any>();
  constructor(private dataService : DataService) { }

  ngOnInit(): void {


    console.log(this.dataService.getPokemon("zygarde"));

  }

}
