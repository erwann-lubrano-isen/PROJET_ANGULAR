import { DataService } from '../data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {

  constructor(private dataService: DataService) {
    console.log(this.dataService.getPokemon(''));
   }

  ngOnInit(): void {
  }

}
