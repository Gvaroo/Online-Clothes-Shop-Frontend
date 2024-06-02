import { GetUserDTO } from '../User/GetUserDTO';
import { GetRatingDTO } from './GetRatingDTO';

export interface GetProductReviewsDTO {
  reviewText: string;
  dateStamp: Date;
  user: GetUserDTO;
  productRating: GetRatingDTO;
}
