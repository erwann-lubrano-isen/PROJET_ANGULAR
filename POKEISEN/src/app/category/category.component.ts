import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input() categories : any;
   category_types=
   [
    {
      name : "status",
      url_file : "https://www.smogon.com/dex/media/images/non-damaging.svg"
    },
    {
      name : "special",
      url_file : "https://www.smogon.com/dex/media/images/non-damaging.svg"
    },
    {name : "physical",
    url_file : "https://www.smogon.com/dex/media/images/physical.svg"
    }
  ]

  formated_categories = new Array<any>();

  constructor() {
    for(let c of this.categories){
		  for(let ic of this.category_types){
			  if(ic.name == c.category.name)this.formated_categories.push(ic);
		  }
	  }
   }

  ngOnInit(): void {
  }

}
