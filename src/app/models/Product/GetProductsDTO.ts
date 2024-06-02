import { GetCategoryDTO } from './GetCategoryDTO';
import { GetProductImageDTO } from './GetProductImageDTO';
import { GetProductSizeDTO } from './GetProductSizeDTO';
import { GetSubCategoriesDTO } from './GetSubCategoriesDTO';

export interface GetProductsDTO {
  id: number;
  name: string;
  price: number;
  quantity: number;
  defaultSize?: GetProductSizeDTO;
  category: GetCategoryDTO;
  subCategories: GetSubCategoriesDTO;
  image?: GetProductImageDTO;
}
