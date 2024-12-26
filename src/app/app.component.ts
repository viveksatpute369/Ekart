import { Component, OnInit } from '@angular/core';
import { CategoryDetails, StoreService } from './store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-store';
  categories: CategoryDetails[] = [];

  constructor(private storeService: StoreService) { }

  async ngOnInit(): Promise<void> {
    this.storeService.getCategories().subscribe(categories => (this.categories = categories));
  }
}
