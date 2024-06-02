import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartDatasDTO } from 'src/app/models/Cart/CartDatasDTO';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cartData!: CartDatasDTO;

  constructor(private _cart: CartService, private _router: Router) {
    this._cart.cartDataObs$.subscribe((cartData) => {
      this.cartData = cartData;
    });
    this._cart.getCartData().subscribe(
      (res) => {
        this.cartData.products = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {}

  updateCart(id: number, quantity: number, sizeId: number): void {
    console.log({ id, quantity, sizeId });
    this._cart.updateCart(id, quantity, sizeId);
  }

  removeCartItem(id: number, sizeId: number): void {
    this._cart.removeProduct(id, sizeId);
  }
  getCartTotal(): number {
    let totalSum = 0;
    this.cartData.products.forEach(
      (prod) => (totalSum += prod.price * prod.quantity)
    );
    return totalSum;
  }
  goToProductPage(id: number) {
    this._router.navigate(['/product', id]);
  }
}
