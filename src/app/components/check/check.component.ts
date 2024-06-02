import { Component } from '@angular/core';
import { CartDatasDTO } from 'src/app/models/Cart/CartDatasDTO';
import { CheckoutDTO } from 'src/app/models/Cart/CheckoutDTO';
import { GetOrderDTO } from 'src/app/models/Cart/GetOrderDTO';
import { GetShippingInfoDTO } from 'src/app/models/Cart/GetShippingInfoDTO';
import { ProductDTO } from 'src/app/models/Cart/ProductDTO';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
})
export class CheckComponent {
  fullName: string = localStorage.getItem('fullName') || '';
  email: string = localStorage.getItem('email') || '';
  currentStep = 1;
  cardNumber!: string;
  cardName!: string;
  cardExpiry!: string;
  cardCode!: string;
  products!: ProductDTO[];
  orderId!: number;

  public shippingInfo: GetShippingInfoDTO = {
    shippingAddress: '',
    shippingCountry: '',
    shippingCity: '',
    zipCode: '',
    phoneNumber: 0,
  };
  cartData!: CartDatasDTO;
  orderedProducts: CartDatasDTO = this.cartData;
  loading = false;
  successMessage = '';
  constructor(private _auth: AuthService, private _cart: CartService) {
    this._cart.getUserShippingInfo().subscribe((response) => {
      if (response.data != null) {
        this.shippingInfo = response.data;
      }
    });
    this._cart.cartDataObs$.subscribe((cartData) => {
      console.log(cartData);
      this.cartData = cartData;
    });
  }
  ngOnInit(): void {}
  submitCheckout() {
    var checkoutData: CheckoutDTO = { shippingInfo: undefined };
    checkoutData.shippingInfo = this.shippingInfo;

    this.loading = true;
    setTimeout(() => {
      console.log(this.cartData);
      this._cart.submitCheckout(checkoutData).subscribe(
        (res: any) => {
          console.log(res);
          this.loading = false;
          this.products = res.data.products;
          this.orderId = res.data.orderId;
          this.currentStep = 4;

          this._cart.clearCart();
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    }, 750);
  }
  getProgressPrecent() {
    return (this.currentStep / 4) * 100;
  }
  submitBilling(): void {
    console.log(this.shippingInfo);
    this.nextStep();
  }

  submitPayment(): void {
    this.nextStep();
  }
  canPaymentSubmit(): boolean {
    return this.cardNumber && this.cardName && this.cardExpiry && this.cardCode
      ? true
      : false;
  }
  nextStep(): void {
    this.currentStep += 1;
  }
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }
  getCartTotal(): number {
    let totalSum = 0;
    this.cartData.products.forEach(
      (prod) => (totalSum += prod.price * prod.quantity)
    );
    return totalSum;
  }
}
