import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryDetails, ItemDetails, StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  items: ItemDetails[] = [];
  categories: CategoryDetails[] = [];

  constructor(private storeService: StoreService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.storeService
      .getItemsByCategory(this.route.snapshot.paramMap.get('listId')!)
      .subscribe(items => (this.items = items));

    this.storeService.getCategories().subscribe(categories => (this.categories = categories));
  }

}
