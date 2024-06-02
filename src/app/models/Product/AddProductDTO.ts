import { UploadImageDTO } from './UploadImageDTO';

export interface AddProductDTO {
  name: string;
  categoryId: number;
  subCategoryId: number;
  description: string;
  price: number;
  quantity: number;
  brandId?: number;
  colorIds?: number[];
  sizeIds?: number[];
  genderId: number;
  newBrand?: string;
  images: UploadImageDTO[];
}
