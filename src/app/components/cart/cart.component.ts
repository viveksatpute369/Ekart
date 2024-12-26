import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemDetails, StoreService } from '../../store.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
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
}
