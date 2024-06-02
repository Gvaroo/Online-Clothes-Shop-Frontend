import { GetBrandDTO } from './GetBrandDTO';
import { GetCategoryDTO } from './GetCategoryDTO';
import { GetColorDTO } from './GetColorDTO';
import { GetGenderDTO } from './GetGenderDTO';
import { GetProductSizeDTO } from './GetProductSizeDTO';
import { GetProductSortDTO } from './GetProductSortDTO';
import { GetSubCategoriesDTO } from './GetSubCategoriesDTO';

export interface GetAllFilterOptionsDTO {
  categories: GetCategoryDTO[];
  subCategories: GetSubCategoriesDTO[];
  brands: GetBrandDTO[];
  colors: GetColorDTO[];
  sizes: GetProductSizeDTO[];
  genders: GetGenderDTO[];
  sortOptions: GetProductSortDTO[];
}
