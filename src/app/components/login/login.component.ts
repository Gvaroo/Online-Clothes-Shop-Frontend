import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalLoginInfoDTO } from 'src/app/models/User/ExternalLoginInfoDTO';
import { LoginUserDTO } from 'src/app/models/User/LoginUserDTO';
import { AuthService } from 'src/app/services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';
import { ValidationError } from 'src/app/models/Validation/ValidationError';
import { cartDataDTO } from 'src/app/models/Cart/CartDataDTO';
import { CartService } from 'src/app/services/cart.service';
import { CartDatasDTO } from 'src/app/models/Cart/CartDatasDTO';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials: LoginUserDTO = {
    email: '',
    password: '',
  };
  externalUser: ExternalLoginInfoDTO = {
    email: '',
    fullName: '',
    provider: '',
    providerKey: '',
  };

  validationError: ValidationError = {};
  loading = false;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private externalAuthService: SocialAuthService,
    private _cart: CartService
  ) {}

  ngOnInit(): void {
    this.externalAuthService.authState.subscribe((user) => {
      this.sendGoogleUserDataToServer(user);
    });
  }

  onSubmit(): void {
    this.loading = true;
    if (!this.credentials.email || !this.credentials.password) {
      this.validationError = { _generic: 'Make sure to fill everything ;)' };
    } else {
      this._auth.login(this.credentials).subscribe(
        (res) => {
          this.loading = false;
          console.log('2141241412412');
          this.sendStoredCartData();
        },
        (err) => {
          if (err && err.error && err.error.errors) {
            // 'err.error.errors' contains the validation errors sent by the API
            const errorsObject = err.error.errors as {
              [key: string]: string[];
            };
            // Initialize the 'error' object to display the validation errors
            this.validationError = {};

            // Iterate through each property in the 'errors' object and extract the error messages
            for (const [field, errors] of Object.entries(errorsObject)) {
              this.validationError[field] = errors.join(' ');
              this.loading = false;
            }
          } else if (err && err.message) {
            // for a generic error message
            this.validationError = { _generic: err.error.message };
            this.loading = false;
          }
        }
      );
    }
  }

  private sendGoogleUserDataToServer(user: SocialUser) {
    (this.externalUser.email = user.email),
      (this.externalUser.providerKey = user.idToken),
      (this.externalUser.fullName = user.name),
      (this.externalUser.provider = user.provider);

    this._auth
      .handleExternalAuthenticationResponse(this.externalUser)
      .subscribe(
        (res) => {
          if (res.data.newUser) {
            const redirectUrl = `/newUser?email=${res.data.email}&fullName=${res.data.fullName}&provider=${res.data.provider}&key=${res.data.providerKey}`;
            window.location.href = redirectUrl;
            console.log('newUserDone');
          } else {
            this.sendStoredCartData();
          }
        },
        (err) => {
          if (err && err.error && err.error.errors) {
            // 'err.error.errors' contains the validation errors sent by the API
            const errorsObject = err.error.errors as {
              [key: string]: string[];
            };
            // Initialize the 'error' object to display the validation errors
            this.validationError = {};

            // Iterate through each property in the 'errors' object and extract the error messages
            for (const [field, errors] of Object.entries(errorsObject)) {
              this.validationError[field] = errors.join(' ');
              this.loading = false;
            }
          } else if (err && err.message) {
            // for a generic error message
            this.validationError = { _generic: err.error.message };
            this.loading = false;
          }
        }
      );
  }

  sendStoredCartData(): void {
    // Get current cart data from localStorage
    var storedCartData!: CartDatasDTO;
    this._cart.cartDataObs$.subscribe((cartData) => {
      storedCartData = cartData;
    });

    // Send cartData to server
    var serverCartData: cartDataDTO[] = [];

    if (storedCartData != undefined) {
      storedCartData.products.forEach((product) => {
        serverCartData.push({
          productId: product.productId,
          quantity: product.quantity,
          guest: true,
          sizeId: product.sizeId,
        });
      });

      this._cart.addUserCartData(serverCartData).subscribe(
        (res) => {
          console.log('success');
          this._router.navigateByUrl('/').then(() => {
            window.location.reload();
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  // Method to check if the 'error' object is empty
  hasErrors(): boolean {
    return Object.keys(this.validationError).length > 0;
  }
  errorKeys(): string[] {
    return Object.keys(this.validationError);
  }
  canSubmit(): boolean {
    return (
      this.credentials.email.length > 0 && this.credentials.password.length > 0
    );
  }
}
