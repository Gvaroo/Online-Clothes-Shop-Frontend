import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { AddProductDTO } from '../models/Product/AddProductDTO';
import { AddProductReviewAndRatingDTO } from '../models/Product/AddProductReviewAndRatingDTO';
import { RestockProductDTO } from '../models/Product/RestockProductDTO';
import { GetFilterDataDTO } from '../models/Product/GetFilterDataDTO';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllProducts(
    pageNumber: number = 1,
    pageSize: number = 9
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(`${this.apiUrl}Product/GetAllProducts`, {
      params,
    });
  }
  getCategoriesAndSubCategories(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/GetCategoriesAndSubCategories`
    );
  }
  getAllFilterOptions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Product/GetAllFilterOptions`);
  }
  GetFilterData(
    filterInfo: GetFilterDataDTO,
    pageNumber: number = 1,
    pageSize: number = 9
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.post<any>(
      `${this.apiUrl}Product/GetFilterData`,
      filterInfo,
      { params }
    );
  }

  addProduct(product: AddProductDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Product/AddProduct`, product, {
      withCredentials: true,
    });
  }
  getProductById(productId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Product/GetProduct/${productId}`, {
      withCredentials: true,
    });
  }
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}Product/DeleteProduct/${productId}`,
      {
        withCredentials: true,
      }
    );
  }
  addProductReviewAndRating(
    newRatingAndReview: AddProductReviewAndRatingDTO
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Product/AddProductReviewAndRating`,
      newRatingAndReview,
      {
        withCredentials: true,
      }
    );
  }
  getProductReviewsAndRatings(productId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}Product/GetProductRatingsAndReviews/${productId}`
    );
  }
  getUserAddedProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}Product/GetUserAddedProducts`, {
      withCredentials: true,
    });
  }
  restockProduct(products: RestockProductDTO[]): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}Product/RestockProducts`,
      products,
      {
        withCredentials: true,
      }
    );
  }
}
