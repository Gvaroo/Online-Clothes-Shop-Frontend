import { GetBrandDTO } from './GetBrandDTO';
import { GetCategoryDTO } from './GetCategoryDTO';
import { GetProductImageDTO } from './GetProductImageDTO';
import { GetProductSizeDTO } from './GetProductSizeDTO';
import { GetSubCategoriesDTO } from './GetSubCategoriesDTO';

export interface GetProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  averageRating: number;
  reviewsCount: number;
  category: GetCategoryDTO;
  subCategories: GetSubCategoriesDTO;
  images?: GetProductImageDTO[];
  brand: GetBrandDTO;
  sizes: GetProductSizeDTO[];
}
