import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AddProductDTO } from 'src/app/models/Product/AddProductDTO';
import { GetAllFilterOptionsDTO } from 'src/app/models/Product/GetAllFilterOptionsDTO';
import { GetSubCategoriesDTO } from 'src/app/models/Product/GetSubCategoriesDTO';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  errorMessage = '';
  loading = false;
  filterOptions!: GetAllFilterOptionsDTO;
  allSubCategories: GetSubCategoriesDTO[] = [];
  @ViewChild('sizeInput') sizeInput!: ElementRef;
  @ViewChild('brandInput') brandInput!: ElementRef;
  productInfo: AddProductDTO = {
    name: null,
    categoryId: null,
    subCategoryId: null,
    description: null,
    price: null,
    quantity: null,
    brandId: null,
    colorIds: [],
    sizeIds: [],
    genderId: null,
    newBrand: null,
    images: [],
  };
  isAddingNewBrand = false;
  isAddingNewSize = false;

  constructor(private productService: ProductService, private _router: Router) {
    this.productService.getAllFilterOptions().subscribe((res) => {
      this.filterOptions = res.data;
      this.allSubCategories = res.data.subCategories;
    });
  }
  onSubmit(): void {
    this.errorMessage = '';
    this.removeDuplicates();
    if (this.canSubmit()) {
      this.loading = true;
      this.productService.addProduct(this.productInfo).subscribe({
        next: (response) => {
          this.loading = false;
          this._router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'An error occurred while adding the product.';
        },
      });
    } else {
      this.loading = false;
      this.errorMessage = 'Make sure to fill all inputs.';
    }
  }

  canSubmit(): boolean {
    const {
      name,
      categoryId,
      subCategoryId,
      description,
      price,
      quantity,
      colorIds,
      sizeIds,
      genderId,
      newBrand,
      brandId,
    } = this.productInfo;
    const requiredFieldsFilled =
      !!name &&
      !!categoryId &&
      !!subCategoryId &&
      !!description &&
      price != null &&
      quantity != null &&
      colorIds.length > 0 &&
      sizeIds.length > 0 &&
      !!genderId;
    const brandProvided = !!newBrand || !!brandId;

    return requiredFieldsFilled && brandProvided;
  }

  sortChange(value: string): void {
    this.filterSubCategories();
  }
  filterSubCategories() {
    // Filter subcategories based on categoryId
    if (this.productInfo.categoryId !== null) {
      this.filterOptions.subCategories = this.allSubCategories.filter(
        (subCategory) => subCategory.categoryId === this.productInfo.categoryId
      );
    } else {
      // If categoryId is null, show all subcategories
      this.filterOptions.subCategories = this.allSubCategories;
    }
  }
  toggleNewBrandInput(): void {
    this.isAddingNewBrand = !this.isAddingNewBrand;
    console.log(this.isAddingNewBrand);
    if (!this.isAddingNewBrand) {
      this.productInfo.newBrand = null;
    }
  }
  onBrandChange(value: any): void {
    if (value === 'new') {
      this.isAddingNewBrand = true;
      this.productInfo.brandId = null;
    } else {
      this.isAddingNewBrand = false;
    }
  }
  cancelNewBrand(): void {
    this.isAddingNewBrand = false;
    this.productInfo.newBrand = null;
  }

  onBrandInputChange(brand: string) {
    this.productInfo.newBrand = brand;
  }

  // Image Upload
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    this.previewImage = file.thumbUrl || '';
    this.previewVisible = true;
  };

  handleChange(info: { file: NzUploadFile; fileList: NzUploadFile[] }): void {
    const { fileList } = info;

    // Clear the current images
    this.productInfo.images = [];

    fileList.forEach((file) => {
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => {
          const imageData = reader.result as string;
          if (imageData.startsWith('data:image')) {
            this.productInfo.images.push({
              id: file.uid,
              imageData: imageData.split(',')[1], // Ensure only Base-64 part is sent
            });
          } else {
            console.error('Invalid image data:', imageData);
          }
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };
      }
    });

    // Update fileList to the current list
    this.fileList = [...fileList];
  }

  // Method to remove duplicate images before submitting
  removeDuplicates() {
    const uniqueImagesMap = new Map<
      string,
      { id: string; imageData: string }
    >();
    this.productInfo.images.forEach((image) => {
      if (!uniqueImagesMap.has(image.imageData)) {
        uniqueImagesMap.set(image.imageData, image);
      }
    });
    this.productInfo.images = Array.from(uniqueImagesMap.values());
  }
}
