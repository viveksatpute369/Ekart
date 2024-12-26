import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/authservice/auth.service';
import { CartItemDetails, CategoryDetails, StoreService } from 'src/app/store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() categories!: CategoryDetails[];
  cart: CartItemDetails[] = [];

  get cartSize() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  constructor(private router: Router, private storeService: StoreService,
    public authService: AuthService,
    public ngZone: NgZone
  ) { }

  onMenuClick(event: Event, category: CategoryDetails) {
    this.router.navigate(['/list', category.name]);
  }

  onCartClick() {
    this.router.navigate(['/cart']);
  }

  ngOnInit(): void {
    this.storeService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

}
