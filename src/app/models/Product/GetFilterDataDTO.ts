export interface GetFilterDataDTO {
  sortId?: number;
  categoryId?: number;
  subCategoryId?: number;
  brandId?: number;
  colorId?: number;
  sizeId?: number;
  genderId?: number;
  minimumPrice?: number;
  maximumPrice?: number;
  productName?: string;
  IsAllFiltersCleared: boolean;
}
