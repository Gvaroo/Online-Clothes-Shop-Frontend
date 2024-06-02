import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Renderer2,
} from '@angular/core';
import { ProductDTO } from 'src/app/models/Cart/ProductDTO';
import { GetAllFilterOptionsDTO } from 'src/app/models/Product/GetAllFilterOptionsDTO';
import { GetCategoryAndSubCategoriesDTO } from 'src/app/models/Product/GetCategoryAndSubCategoriesDTO';
import { GetFilterDataDTO } from 'src/app/models/Product/GetFilterDataDTO';
import { GetProductsDTO } from 'src/app/models/Product/GetProductsDTO';
import { GetSubCategoriesDTO } from 'src/app/models/Product/GetSubCategoriesDTO';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  products: GetProductsDTO[] = [];
  totalProducts: number = 20;
  filterOptions!: GetAllFilterOptionsDTO;
  allSubCategories: GetSubCategoriesDTO[] = [];
  loading = false;
  additionalLoading = false;
  isMenuOpen = false;
  dropdownVisible = false;
  dropdownValue: string = 'Select Range';
  pageSize = 9;
  pageIndex = 1;
  isFilterDataNull = false;
  filterData: GetFilterDataDTO = {
    sortId: undefined,
    categoryId: undefined,
    subCategoryId: undefined,
    brandId: undefined,
    colorId: undefined,
    genderId: undefined,
    minimumPrice: undefined,
    maximumPrice: undefined,
    productName: undefined,
    IsAllFiltersCleared: true,
  };

  updateDropdownValue(mobile: boolean) {
    if (
      this.filterData.minimumPrice !== undefined &&
      this.filterData.maximumPrice !== undefined
    ) {
      if (
        this.filterData.minimumPrice === 0 &&
        this.filterData.maximumPrice === 0
      ) {
        this.filterData.minimumPrice = undefined;
        this.filterData.maximumPrice = undefined;
        this.dropdownValue = 'Select Range';
      } else {
        this.dropdownValue = `${this.filterData.minimumPrice}$ - ${this.filterData.maximumPrice}$`;
      }
    } else {
      this.dropdownValue =
        this.filterData.minimumPrice !== undefined
          ? `${this.filterData.minimumPrice}$ - Maximum`
          : this.filterData.maximumPrice !== undefined
          ? `Minimum - ${this.filterData.maximumPrice}$`
          : 'Select Range';
    }

    if (!mobile) this.sendFilterData();
  }
  searchProduct() {
    this.sendFilterData();
  }
  isLargeOrMediumScreen(): boolean {
    return window.innerWidth >= 768; // Large screens
  }

  isMobileScreen(): boolean {
    return window.innerWidth < 768; // Mobile screens
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.productService.getAllFilterOptions().subscribe((res) => {
      this.filterOptions = res.data;
      this.allSubCategories = res.data.subCategories;
    });
  }

  sortChange(value: string): void {
    // Check if any filter properties have values
    const hasActiveFilters = Object.values(this.filterData).some(
      (value) => !!value
    );
    this.filterData.IsAllFiltersCleared = !hasActiveFilters;
    this.filterSubCategories();

    this.sendFilterData();
  }

  public screenWidth: any;
  public screenHeight: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.loading = true;

    setTimeout(() => {
      this.loadProducts();
    }, 500);
  }
  selectedGender: any;
  selectedCategory: any;
  onGenderSelected(item: any) {
    this.selectedGender = item.id;
  }

  onCategorySelected(item: any) {
    this.selectedCategory = item.id;
  }

  onMobileFilterSelected(filterType: string, selectedId: number | undefined) {
    if (this.filterData[filterType] == selectedId) {
      this.filterData[filterType] = undefined;
      this.changeNzMenuBackgroundColor(filterType);
    } else this.filterData[filterType] = selectedId;

    this.filterSubCategories();
  }

  filterMobileItems() {
    const hasActiveFilters = Object.values(this.filterData).some(
      (value) => !!value
    );
    this.filterData.IsAllFiltersCleared = !hasActiveFilters;
    console.log(this.filterData);
    this.sendFilterData();

    this.toggleMenu();
  }
  sendFilterData() {
    this.loading = true;
    this.productService
      .GetFilterData(this.filterData, this.pageIndex, this.pageSize)
      .subscribe(
        (res: any) => {
          this.products = res.data.items;
          this.totalProducts = res.data.totalCount;
          this.loading = false;
          if (res.data.totalCount == 0) this.isFilterDataNull = true;
          else this.isFilterDataNull = false;
        },
        (err) => {
          console.log(err.message);
          this.loading = false;
        }
      );
  }
  filterSubCategories() {
    // Filter subcategories based on categoryId
    if (this.filterData.categoryId !== undefined) {
      this.filterOptions.subCategories = this.allSubCategories.filter(
        (subCategory) => subCategory.categoryId === this.filterData.categoryId
      );
    } else {
      // If categoryId is undefined, show all subcategories
      this.filterOptions.subCategories = this.allSubCategories;
    }
  }
  clearItems() {
    this.filterData = { ...this.filterData } as GetFilterDataDTO;
    Object.keys(this.filterData).forEach(
      (key) => (this.filterData[key] = undefined)
    );
    this.filterData.productName = undefined;
    this.filterData.minimumPrice = undefined;
    this.filterData.maximumPrice = undefined;
    this.filterData.IsAllFiltersCleared = true;
    this.dropdownValue = 'Select Range';
    this.changeNzMenuBackgroundColor();
    this.sendFilterData();
  }
  changeNzMenuBackgroundColor(filterType?: string) {
    const menuItems = document.querySelectorAll(
      '.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected'
    );

    menuItems.forEach((menuItem) => {
      const anchor = menuItem.querySelector('a');
      if (anchor) {
        if (this.filterData[filterType] === undefined) {
          // Apply background color when selected
          this.renderer.setStyle(menuItem, 'background-color', 'transparent');
          this.renderer.setStyle(anchor, 'color', 'black');
        } else {
          // Remove background color when deselected
          this.renderer.removeStyle(menuItem, 'background-color');
          this.renderer.removeStyle(anchor, 'color');
        }
      }
    });

    // Select the active menu item
    const menuItem = document.querySelector('.active');
    if (menuItem) {
      // Ensure menuItem exists
      this.renderer.setStyle(menuItem, 'color', 'white');
    }
  }
  loadProducts(): void {
    this.productService.getAllProducts(this.pageIndex, this.pageSize).subscribe(
      (res: any) => {
        this.products = res.data.items;
        this.totalProducts = res.data.totalCount;
        console.log(res);
        this.loading = false;
      },
      (err) => {
        console.log(err.message);
        this.loading = false;
      }
    );
  }
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    if (this.filterData.IsAllFiltersCleared) this.loadProducts();
    else this.sendFilterData();
  }

  filters = [
    { key: 'sortId', placeholder: 'Sort', optionsKey: 'sortOptions' },
    { key: 'genderId', placeholder: 'Gender', optionsKey: 'genders' },
    { key: 'categoryId', placeholder: 'Category', optionsKey: 'categories' },
    {
      key: 'subCategoryId',
      placeholder: 'Product Type',
      optionsKey: 'subCategories',
    },
    { key: 'brandId', placeholder: 'Brand', optionsKey: 'brands' },
    { key: 'colorId', placeholder: 'Color', optionsKey: 'colors' },
  ];

  shouldShowClearAll(): boolean {
    return (
      Object.keys(this.filterData).filter((key) => this.filterData[key])
        .length > 1
    );
  }
}
