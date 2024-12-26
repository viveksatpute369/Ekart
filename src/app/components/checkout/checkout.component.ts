import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemDetails, StoreService } from '../../store.service';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  cart: CartItemDetails[] = [];

  paymentRequest: google.payments.api.PaymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: '17613812255336763067',
      merchantName: 'Demo Only (you will not be charged)',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: this.cartTotal.toFixed(2),
      currencyCode: 'USD',
      countryCode: 'US',
    },
  };

  get cartSize() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal() {
    return this.cart.reduce((total, item) => total + item.quantity * item.item.price, 0);
  }

  constructor(private storeService: StoreService, private router: Router) { }

  ngOnInit(): void {
    this.storeService.getCart().subscribe(cart => {
      this.cart = cart;

      this.paymentRequest.transactionInfo.totalPrice = this.cartTotal.toFixed(2);
    });
  }

  onCheckout() {
    this.router.navigate(['/checkout']);
  }

  onRemove(cartItem: CartItemDetails) {
    this.storeService.removeCartItem(cartItem);
  }

  onQuantityChange(event: Event, cartItem: CartItemDetails) {
    const input = event.target as HTMLInputElement;
    this.storeService.updateCartItemQuantity({ ...cartItem, quantity: input.valueAsNumber });
  }

  async onLoadPaymentData(event: Event) {
    const paymentData = (event as CustomEvent<google.payments.api.PaymentData>).detail;
    await this.storeService.processOrder(this.cart, paymentData);

    this.storeService.setCart([]);
    this.router.navigate(['/confirm']);
  }



  firstName: string = '';
  lastName: string = '';
  address1: string = '';
  address2: string = '';
  city: string = '';
  state: string = '';
  zip: string = '';
  country: string = '';
  cardName: string = '';
  cardNumber: string = '';
  expDate: string = '';
  cvv: string = '';


  async onSubmit(event: Event, form: NgForm) {
    event.preventDefault();

    this.storeService
      .getCart()
      .pipe(first())
      .subscribe(
        async cartItems => {
          await this.storeService.processOrder(cartItems, {
            shippingAddress: {
              address1: this.address1,
              address2: this.address2,
              administrativeArea: this.state,
              countryCode: this.country,
              locality: this.city,
              postalCode: this.zip,
            },
            paymentMethodData: {
              type: 'CARD_NUMBER',
              card: {
                csc: this.cvv,
                exp: this.expDate,
                name: this.cardName,
                number: this.cardNumber,
              },
            },
          });
        },
        error => { },
        () => {
          this.storeService.setCart([]);
          this.router.navigate(['/confirm']);
        },
      );
  }


}
