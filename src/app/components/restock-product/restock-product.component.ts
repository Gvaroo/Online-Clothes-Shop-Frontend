import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GetProductsDTO } from 'src/app/models/Product/GetProductsDTO';
import { RestockProductDTO } from 'src/app/models/Product/RestockProductDTO';
import { ValidationError } from 'src/app/models/Validation/ValidationError';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-restock-product',
  templateUrl: './restock-product.component.html',
  styleUrls: ['./restock-product.component.scss'],
})
export class RestockProductComponent {
  validationError: ValidationError = {};
  loading: boolean = false;
  products!: GetProductsDTO[];
  changedProducts: RestockProductDTO[] = [];
  constructor(
    private productService: ProductService,
    private _notification: NzNotificationService,
    private router: Router
  ) {
    this.productService.getUserAddedProducts().subscribe((res) => {
      this.products = res.data;
    });
  }

  restockProducts() {
    this.loading = true;
    if (this.changedProducts.length > 0) {
      this.productService
        .restockProduct(this.changedProducts)
        .subscribe((res) => {
          this.loading = false;
          this._notification.create('success', 'Profile', res.data);
          this.router.navigateByUrl('/restockProducts').then(
            () => {
              window.location.reload();
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
        });
    } else {
      this.validationError = { _generic: "You didn't restock any products :)" };
      this.loading = false;
    }
  }
  onQuantityChange(item: any) {
    const existingChange = this.changedProducts.find(
      (cp) => cp.productId === item.id
    );

    if (existingChange) {
      existingChange.restockQuantity = item.quantity;
    } else {
      this.changedProducts.push({
        productId: item.id,
        restockQuantity: item.quantity,
      });
    }
  }
  // Method to check if the 'error' object is empty
  hasErrors(): boolean {
    return Object.keys(this.validationError).length > 0;
  }
  errorKeys(): string[] {
    return Object.keys(this.validationError);
  }
}
