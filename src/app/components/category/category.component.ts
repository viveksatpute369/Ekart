import { Component, Input, OnInit } from '@angular/core';
import { CategoryDetails } from '../../store.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() category!: CategoryDetails;

  constructor() { }

  ngOnInit(): void { }
}
