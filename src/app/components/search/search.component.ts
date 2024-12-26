import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryDetails, ItemDetails, StoreService } from 'src/app/store.service';

const cat: CategoryDetails = {
  name: 'jj',
  title: 'this',
  image: 'string',
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  categories: CategoryDetails[] = [];
  searchText: any;
  constructor(private storeService: StoreService, private route: ActivatedRoute) { }

  /**************************************/

  ngOnInit() {
    this.storeService.getCategories().subscribe(categories => (this.categories = categories));
  }

}
