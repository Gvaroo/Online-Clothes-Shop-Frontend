import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { CartDatasDTO } from '../models/Cart/CartDatasDTO';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductDTO } from '../models/Cart/ProductDTO';
import { AuthService } from './auth.service';
import { cartDataDTO } from '../models/Cart/CartDataDTO';
import { CheckoutDTO } from '../models/Cart/CheckoutDTO';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl;
  cartData: CartDatasDTO = {
    products: [],
  };
  cartDataObs$ = new BehaviorSubject(this.cartData);

  constructor(
    private _notification: NzNotificationService,
    private http: HttpClient,
    private auth: AuthService
  ) {
    let localCartData = localStorage.getItem('cart');
    if (localCartData !== null) {
      try {
        this.cartData = JSON.parse(localCartData) as CartDatasDTO;
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
    this.cartDataObs$.next(this.cartData);
  }
  submitCheckout(data: CheckoutDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Cart/Checkout`, data, {
      withCredentials: true,
    });
  }
  getUserOrderHistory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Cart/GetUserOrderHistory`, {
      withCredentials: true,
    });
  }
  getUserShippingInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Cart/GetShippingInfo`, {
      withCredentials: true,
    });
  }
  addUserCartData(cartData: cartDataDTO[]): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Cart/AddOrUpdateProductsToCart`,
      cartData,
      {
        withCredentials: true,
      }
    );
  }
  removeProductFromCart(productData: cartDataDTO): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Cart/DeleteProductFromCart`,
      productData,
      {
        withCredentials: true,
      }
    );
  }
  getCartData(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}Cart/GetUserCartData`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          //update local storage with user cartData
          this.cartData.products = response.data;
        })
      );
  }
  addProduct(params: ProductDTO): void {
    const product: ProductDTO = params;

    if (!this.isProductInCart(product.productId, product.sizeId)) {
      if (product.quantity) this.cartData.products.push(product);
      else
        this.cartData.products.push({
          ...product,
          quantity: 1,
          sizeId: params.sizeId,
        });
    } else {
      // copy array, find item index and update
      let updatedProducts = [...this.cartData.products];
      let productIndex = updatedProducts.findIndex(
        (prod) =>
          prod.productId == params.productId && prod.sizeId == params.sizeId
      );
      let product = updatedProducts[productIndex];
      // if no quantity, increment
      if (product.quantity) {
        updatedProducts[productIndex] = {
          ...product,
          quantity: product.quantity + params.quantity,
        };
      } else {
        updatedProducts[productIndex] = {
          ...product,
          quantity: params.quantity + 1,
        };
      }
      this.cartData.products = updatedProducts;
    }

    this._notification.create(
      'success',
      'Product added to cart',
      `${product.name} was successfully added to the cart`
    );
    this.cartDataObs$.next({ ...this.cartData });
    localStorage.setItem('cart', JSON.stringify(this.cartData));

    ///send cartData to server
    var serverCartData: cartDataDTO[] = [];

    this.cartData.products.forEach((product) => {
      serverCartData.push({
        productId: product.productId,
        quantity: product.quantity,
        sizeId: product.sizeId,
      });
    });

    this.addUserCartData(serverCartData).subscribe(
      (res) => {
        console.log('success');
      },
      (err) => {
        console.log(err);
      }
    );
  }
  updateCart(id: number, quantity: number, sizeId: number): void {
    // copy array, find item index and update
    let updatedProducts = [...this.cartData.products];
    let productIndex = updatedProducts.findIndex(
      (prod) => prod.productId === id && prod.sizeId === sizeId
    );
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      quantity: quantity,
      sizeId: sizeId,
    };
    this.cartData.products = updatedProducts;
    this.cartDataObs$.next({ ...this.cartData });
    localStorage.setItem('cart', JSON.stringify(this.cartData));

    ///send cartData to server
    var serverCartData: cartDataDTO[] = [];

    this.cartData.products.forEach((product) => {
      serverCartData.push({
        productId: product.productId,
        quantity: product.quantity,
        sizeId: product.sizeId,
      });
    });

    this.addUserCartData(serverCartData).subscribe(
      (res) => {
        console.log('success');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  removeProduct(id: number, sizeId: number): void {
    // Find the product to be removed from the cart on the client side
    let deleteProductIndex = this.cartData.products.findIndex(
      (prod) => prod.productId == id && prod.sizeId == sizeId
    );

    if (deleteProductIndex !== -1) {
      // Create DTO for the product to be removed
      var serverCartData: cartDataDTO = {
        productId: this.cartData.products[deleteProductIndex].productId,
        quantity: this.cartData.products[deleteProductIndex].quantity,
        sizeId: this.cartData.products[deleteProductIndex].sizeId,
      };

      // Remove the product from the server
      this.removeProductFromCart(serverCartData).subscribe(
        (res) => {
          console.log('Success: Product removed from the server cart.');
        },
        (err) => {
          console.log('Error:', err);
        }
      );

      // Remove the product from the local cart data
      this.cartData.products.splice(deleteProductIndex, 1);

      // Update the observable and local storage
      this.cartDataObs$.next({ ...this.cartData });
      localStorage.setItem('cart', JSON.stringify(this.cartData));

      // Show notification
      this._notification.create(
        'success',
        'Removed successfully',
        'The selected item was removed from the cart successfully'
      );
    } else {
      console.log('Error: Product not found in the cart.');
    }
  }

  clearCart(): void {
    this.cartData = {
      products: [],
    };
    this.cartDataObs$.next({ ...this.cartData });
    localStorage.setItem('cart', JSON.stringify(this.cartData));
  }
  isProductInCart(id: number, sizeId: number): boolean {
    return (
      this.cartData.products.findIndex(
        (prod) => prod.productId === id && prod.sizeId == sizeId
      ) !== -1
    );
  }
}
