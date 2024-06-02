import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { map } from 'rxjs';
import { ProductDTO } from 'src/app/models/Cart/ProductDTO';
import { GetProductDTO } from 'src/app/models/Product/GetProductDTO';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  id!: number;
  product!: GetProductDTO;
  quantity!: number;
  showcaseImages: any[] = [];
  loading = false;
  sizeId: number;

  constructor(
    private _route: ActivatedRoute,
    private _product: ProductService,
    private _cart: CartService,
    private _sharedService: SharedService,
    private _notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this._route.paramMap
      .pipe(
        map((param: any) => {
          return param.params.id;
        })
      )
      .subscribe((productId) => {
        // returns string so convert it to number        ;
        this.id = parseInt(productId);
        this._product.getProductById(productId).subscribe((product) => {
          this.product = product.data;
          console.log(product.data);
          this._sharedService.setProductInfoForReview(
            this.id,
            this.product.averageRating
          );
          if (product.data.quantity === 0) this.quantity = 0;
          else this.quantity = 1;
          this.loading = false;
        });
      });
  }

  addToCart(): void {
    var productData: ProductDTO = {
      productId: this.id,
      name: this.product.name,
      image: this.product.images[0]?.imageUrl,
      price: this.product.price,
      quantity: this.quantity,
      maxQuantity: this.product.quantity,
    };
    if (this.sizeId != null) {
      console.log(this.sizeId);
      productData.sizeId = this.sizeId;
      this._cart.addProduct(productData);
    } else {
      this._notification.create(
        'error',
        'Choose Product Size',
        `Please choose product size before adding item to cart`
      );
    }
  }
}
