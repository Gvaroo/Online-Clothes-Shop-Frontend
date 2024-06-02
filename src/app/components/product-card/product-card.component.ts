import { Component, Input } from '@angular/core';
import { GetProductsDTO } from 'src/app/models/Product/GetProductsDTO';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() getProducts: GetProductsDTO | undefined;
  @Input() onAdd: any;
}
