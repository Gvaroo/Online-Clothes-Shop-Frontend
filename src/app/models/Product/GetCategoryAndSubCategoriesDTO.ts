import { GetSubCategoriesDTO } from './GetSubCategoriesDTO';

export interface GetCategoryAndSubCategoriesDTO {
  id: number;
  name: string;
  subCategories: GetSubCategoriesDTO[];
}
