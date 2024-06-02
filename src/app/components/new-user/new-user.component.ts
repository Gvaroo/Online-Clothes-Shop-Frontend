import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cartDataDTO } from 'src/app/models/Cart/CartDataDTO';
import { CartDatasDTO } from 'src/app/models/Cart/CartDatasDTO';
import { ExternalLoginInfoDTO } from 'src/app/models/User/ExternalLoginInfoDTO';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent {
  constructor(
    private route: ActivatedRoute,
    private _auth: AuthService,
    private _router: Router,
    private _cart: CartService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.userInfo.email = params['email'];
      this.userInfo.fullName = params['fullName'];
      this.userInfo.provider = params['provider'];
      this.userInfo.providerKey = params['key'];
    });
  }
  userInfo: ExternalLoginInfoDTO = {
    email: '',
    fullName: '',
    provider: '',
    providerKey: '',
  };
  errorMessage = '';
  loading = false;

  onSubmit() {
    if (this.userInfo.email && this.userInfo.fullName) {
      this.loading = true;
      this._auth.createNewExternalUser(this.userInfo).subscribe(
        (res) => {
          this.loading = false;
          this.sendStoredCartData();
          this._router.navigateByUrl('/').then(() => {
            window.location.reload();
          });
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.loading = false;
        }
      );
    } else {
      this.errorMessage = 'Make sure to fill everything ;)';
    }
  }
  sendStoredCartData(): void {
    // Get current cart data from localStorage
    var storedCartData!: CartDatasDTO;
    this._cart.cartDataObs$.subscribe((cartData) => {
      storedCartData = cartData;
    });

    // Send cartData to server
    var serverCartData: cartDataDTO[] = [];
    console.log(storedCartData);

    if (storedCartData != undefined) {
      storedCartData.products.forEach((product) => {
        serverCartData.push({
          productId: product.productId,
          quantity: product.quantity,
          sizeId: product.sizeId,
          guest: true,
        });
      });

      this._cart.addUserCartData(serverCartData).subscribe(
        (res) => {
          console.log('success');
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
