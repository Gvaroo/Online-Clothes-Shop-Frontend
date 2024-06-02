import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AddProductReviewAndRatingDTO } from 'src/app/models/Product/AddProductReviewAndRatingDTO';

import { GetProductRatingAndReviewDTO } from 'src/app/models/Product/GetProductRatingAndReviewDTO';
import { ReviewsData } from 'src/app/models/Product/ReviewsData';
import { ValidationError } from 'src/app/models/Validation/ValidationError';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent {
  reviewInfo!: ReviewsData;
  showModal: boolean = false;
  public productRatingAndReviews!: GetProductRatingAndReviewDTO;
  validationError: ValidationError = {};
  loading = false;
  addReview: AddProductReviewAndRatingDTO = {
    productId: 0,
    ratingValue: 0,
    review: '',
  };
  constructor(
    private _product: ProductService,
    private _sharedService: SharedService,
    private _router: Router
  ) {
    this.reviewInfo = this._sharedService.getProductInfo();
    this._product
      .getProductReviewsAndRatings(this.reviewInfo.productId)
      .subscribe(
        (response) => {
          console.log(response.data);
          this.productRatingAndReviews = response.data;
        },
        (error) => {}
      );
  }
  openModal(): void {
    this.showModal = true;
  }
  // Method to check if the 'error' object is empty
  hasErrors(): boolean {
    return Object.keys(this.validationError).length > 0;
  }
  errorKeys(): string[] {
    return Object.keys(this.validationError);
  }
  closeModal(): void {
    this.loading = false;
    this.showModal = false;
  }
  onSubmit(): void {
    this.loading = true;
    this.addReview.productId = this.reviewInfo.productId;
    console.log(this.addReview);
    this._product.addProductReviewAndRating(this.addReview).subscribe(
      (res) => {
        this.loading = false;
        this._router
          .navigate(['/product', this.addReview.productId])
          .then(() => {
            window.location.reload();
          });
      },
      (err) => {
        console.log(err);
        if (err.status === 401) {
          // For 401 Unauthorized response,
          this.validationError = { _generic: 'You must be authorized.' };
          this.loading = false;
        }
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
