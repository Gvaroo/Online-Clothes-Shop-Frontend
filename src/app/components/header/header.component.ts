import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CartDatasDTO } from 'src/app/models/Cart/CartDatasDTO';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  screenHeight: any;
  screenWidth: any;
  isMenuOpen = false;
  isMobile = false;
  isLoggedIn = false;
  dropdownVisible = false;
  isAdmin = false;
  cartData!: CartDatasDTO;

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 768) this.isMobile = false;
    else this.isMobile = true;
  }
  constructor(
    private _auth: AuthService,
    private _cart: CartService,
    private router: Router
  ) {
    this.getScreenSize();
    this.checkUser();

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

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  removeProductFromCart(id: number, sizeId: number) {
    this._cart.removeProduct(id, sizeId);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  logout() {
    this._auth.logout().subscribe(
      (response) => {
        this.router.navigateByUrl('/').then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error(error);
      }
    );
    this.isMenuOpen = false;
  }

  checkUser(): boolean {
    this._auth.isLoggedIn().subscribe(
      (res) => {
        if (res.data) {
          this.isLoggedIn = true;
          this.handleLoggedInUser();
          return true;
        } else {
          this.isLoggedIn = false;
          return false;
        }
      },
      (err) => {
        this.isLoggedIn = false;
        return false;
      }
    );
    return false;
  }
  handleLoggedInUser(): void {
    if (this.isLoggedIn) {
      this._auth.isAdmin().subscribe((response) => {
        if (response.data) this.isAdmin = true;
        else this.isAdmin = false;
      });
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
