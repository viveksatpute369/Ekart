import { Component, OnInit } from '@angular/core';
import { CategoryDetails, StoreService } from '../../store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: CategoryDetails[] = [];

  constructor(private storeService: StoreService) { }

  async ngOnInit(): Promise<void> {

    this.storeService.getCategories().subscribe(categories => (this.categories = categories));
  }
}
