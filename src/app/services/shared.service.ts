import { Injectable } from '@angular/core';
import { ReviewsData } from '../models/Product/ReviewsData';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private reviewData: ReviewsData = {
    productId: 0,
    rating: 0,
  };
  setProductInfoForReview(id: number, rating: number) {
    this.reviewData.productId = id;
    this.reviewData.rating = rating;
  }

  getProductInfo() {
    return this.reviewData;
  }
}
