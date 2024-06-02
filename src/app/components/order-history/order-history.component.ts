import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent {
  orders: any[] = [];
  error = '';
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getUserOrderHistory().subscribe(
      (res: any) => {
        this.orders = res.data;
      },
      (err) => {
        this.error = err.error.message;
      }
    );
  }
}
