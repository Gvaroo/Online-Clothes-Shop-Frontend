export interface ProductDTO {
  productId: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
  productSize?: string;
  sizeId?: number;
}
