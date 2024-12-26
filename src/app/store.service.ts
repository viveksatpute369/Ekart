import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export interface CategoryDetails {
  name: string;
  title: string;
  image: string;
}

export interface ItemDetails {
  name: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  largeImage: string;
}

export interface CartItemDetails {
  item: ItemDetails;
  size: string;
  quantity: number;
}

const categories: CategoryDetails[] = [
  {
    name: 'mens',          // json category name
    title: "Men's Wear",
    image: 'https://rukminim1.flixcart.com/image/832/832/ke0a7ww0-0/shirt/x/i/z/40-11896070-roadster-original-imafus4ehu8hahj9.jpeg?q=70',
  },
  {
    name: 'womens',          // json category name
    title: "Lady's Wear",
    image: 'https://rukminim1.flixcart.com/image/832/832/l5bd5zk0/kurta/m/p/z/xl-kr568a-latest-kurta-metro-fashion-original-imaggyphhhqargfp.jpeg?q=70',
  },
  {
    name: 'kids',          // json category name
    title: "Baby & Kids",
    image: 'https://rukminim1.flixcart.com/image/832/832/l5fnhjk0/kids-t-shirt/z/c/o/8-9-years-by22-2pck-hs-blk-nvy-mindfull-jump-cuts-original-imagg3srqswybzvg.jpeg?q=70',
  },
  {
    name: 'smartphones',          // json category name
    title: "Mobiles & Tablets",
    image: 'https://rukminim1.flixcart.com/image/416/416/xif0q/mobile/b/q/s/-original-imaghbeqtgzsfzvc.jpeg?q=70',
  },
  {
    name: 'laptops',          // json category name
    title: "Laptops",
    image: 'https://rukminim1.flixcart.com/image/416/416/xif0q/computer/m/t/2/-original-imagg56h57gzvdgv.jpeg?q=70',
  },
  {
    name: 'appliances',          // json category name
    title: "TVs & Appliances",
    image: 'https://rukminim1.flixcart.com/image/416/416/l3bx5e80/television/q/s/t/-original-imageh4cwzbhfrxw.jpeg?q=70',
  },
  {
    name: 'books',          // json category name
    title: "Books & Comics",
    image: 'https://rukminim1.flixcart.com/image/416/416/jph83gw0/book/5/0/7/the-best-of-sudeep-nagarkar-original-imafbpg2hzdks6hz.jpeg?q=70',
  },
  {
    name: 'sports',          // json category name
    title: "Sports & More",
    image: 'https://rukminim1.flixcart.com/image/416/416/kit/g/g/v/silver-s-pro-170-original-imadryy3zwhwtqnc.jpeg?q=70',
  },

];

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private itemsCache: Map<string, Observable<ItemDetails[]>>;
  private cart: CartItemDetails[];
  private cartSubject?: Subject<CartItemDetails[]>;
  public search = new BehaviorSubject<string>("");
  constructor(private http: HttpClient) {
    this.itemsCache = new Map();
    this.cart = [];
  }

  private getStorage<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  private setStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getCategories() {
    return from([categories]);
  }

  getItemsByCategory(name: string) {
    let cat = this.itemsCache.get(name);
    if (cat) return cat;

    cat = this.http.get<ItemDetails[]>(`/assets/data/${name}.json`);
    this.itemsCache.set(name, cat);

    return cat;
  }

  getItem(category: string, name: string) {
    return this.getItemsByCategory(category).pipe(mergeMap(items => from([items.find(item => item.name === name)])));
  }

  getProducts(name: any) {
    let cat = this.itemsCache.get(name);
    if (cat) return cat;

    cat = this.http.get<ItemDetails[]>(`/assets/data/${name}.json`);
    this.itemsCache.set(name, cat);

    return cat;
  }

  addItemToCart(item: ItemDetails, size: string, quantity: number) {
    let existing = this.cart.find(c => c.item.name === item.name && c.size === size);

    if (!existing) {
      this.cart = [
        ...this.cart,
        {
          item,
          size,
          quantity,
        },
      ];
    } else {
      existing.quantity += quantity;
      this.cart = [...this.cart];
    }

    this.setCart(this.cart);
  }

  removeCartItem(cartItem: CartItemDetails) {
    this.cart = this.cart.filter(c => !(c.item.name === cartItem.item.name && c.size === cartItem.size));

    this.setCart(this.cart);
  }

  updateCartItemQuantity(cartItem: CartItemDetails) {
    let existing = this.cart.find(c => c.item.name === cartItem.item.name && c.size === cartItem.size);

    if (!existing) {
      this.cart = [...this.cart, cartItem];
    } else {
      existing.quantity = cartItem.quantity;
      this.cart = [...this.cart];
    }

    this.setCart(this.cart);
  }

  getCart(): Observable<CartItemDetails[]> {
    if (!this.cartSubject) {
      this.cart = this.getStorage<CartItemDetails[]>('cart') || [];
      this.cartSubject = new BehaviorSubject(this.cart);
    }
    return this.cartSubject;
  }

  setCart(cart: CartItemDetails[]) {
    this.cart = cart;
    this.cartSubject!.next(cart);
    this.setStorage('cart', cart);
  }

  /** Mock service to process order */
  processOrder(cart: CartItemDetails[], paymentData: any) {
    console.log(
      'TODO: send order to server',
      cart,
      paymentData.shippingAddress,
      paymentData.shippingOptionData?.id,
      paymentData.paymentMethodData,
    );

    return Promise.resolve({
      orderId: Date.now().valueOf().toString(),
    });
  }
}
