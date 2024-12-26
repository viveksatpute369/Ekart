import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemDetails, StoreService } from 'src/app/store.service';

function unescapeHtml(text: string) {
  const elem = document.createElement('textarea');
  elem.innerHTML = text;
  return elem.textContent || '';
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {
  item!: ItemDetails;
  size = 'M';
  sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
  quantity = 1;
  quantityOptions = [1, 2, 3, 4, 5];

  paymentRequest!: google.payments.api.PaymentDataRequest;

  get itemDescription() {
    return unescapeHtml(this.item.description);
  }

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.storeService
      .getItem(this.route.snapshot.paramMap.get('listId')!, this.route.snapshot.paramMap.get('itemId')!)
      .subscribe(item => {
        this.item = item!;

        this.paymentRequest = {
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
            totalPrice: this.item.price.toFixed(2),
            currencyCode: 'USD',
            countryCode: 'US',
          },
        };
      });
  }

  onAddToCart() {
    this.storeService.addItemToCart(this.item, this.size, this.quantity);
    const snackbar = this.snackBar.open(`${this.item.title} added to cart.`, 'view cart', {
      duration: 5000,
    });
    snackbar.onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }

  async onLoadPaymentData(event: Event) {
    const paymentData = (event as CustomEvent<google.payments.api.PaymentData>).detail;
    await this.storeService.processOrder(
      [
        {
          item: this.item,
          quantity: this.quantity,
          size: this.size,
        },
      ],
      paymentData,
    );

    this.router.navigate(['/confirm']);
  }
}
