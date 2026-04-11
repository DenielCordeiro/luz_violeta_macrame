import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ProductsService } from '../services/products/products.service';

import { Product } from '../interfaces/product.interface';

import { AddOrEditProductComponent } from './add-or-edit-product/add-or-edit-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';

import { MOCK_PRODUCTS } from './products.mock';

@Component({
  selector: 'app-products',
  standalone: true,
   imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass'],
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollAnchor') anchor!: ElementRef;
  observer!: IntersectionObserver;

  productId: number | undefined;
  title: string = 'Trabalhos disponíveis';
  products: Product[] = [];
  currentPage: number = 1;
  pageSize: number = 9;
  hasNextPage: boolean = true;
  isLoading: boolean = false;

  constructor(
    public dialog: MatDialog,
    public productsService: ProductsService
  ) {}

  ngOnInit(): void {
    // this.gettingProducts();
    this.loadProducts();
    this.clearProductLocalStorage();
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      const oldPageSize = this.pageSize;

      if (oldPageSize !== this.pageSize) {
        this.resetAndReload();
      }
    });

    this.createObserver();
  }

  resetAndReload(): void {
    this.products = [];
    this.currentPage = 1;
    this.hasNextPage = true;
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting && !this.isLoading && this.hasNextPage) {

        this.observer.unobserve(this.anchor.nativeElement);

        this.loadProducts(this.currentPage + 1);

        setTimeout(() => {
          this.observer.observe(this.anchor.nativeElement);
        }, 3000);
      }
    }, {
      root: null,
      threshold: 0
    });

    this.observer.observe(this.anchor.nativeElement);
  }

  loadProducts(page: number = 1): void {
    if (this.isLoading || !this.hasNextPage) return;

    this.isLoading = true;

    setTimeout(() => {
      const allProducts = MOCK_PRODUCTS;

      const limit = this.pageSize;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedDocs = allProducts.slice(startIndex, endIndex);

      this.products = [
        ...this.products,
        ...paginatedDocs
      ];

      this.currentPage = page;
      this.hasNextPage = endIndex < allProducts.length;

      this.isLoading = false;
    }, 3000);
  }

  clearProductLocalStorage(): void {
    this.productsService.removeProductSelected();
  }

  gettingProducts(): void {
    this.productsService.getProducts()
      .then(loadedProducts => {        
        if(loadedProducts == null || loadedProducts == undefined) {
          alert("[Atenção]: Não existe nenhum produto a venda!")
        } else {
          this.products = loadedProducts.products.docs as Product[];
        }        
      })
      .catch(error => {
        alert('ERRO: não conseguiu trazer os produtos');
        console.log(error);
      })
  }

  setProductInLocalStorage(product: Product): void {
    this.productsService.addProductLocalStorage(product);
  }

  modalCreate(product: Product | null): void {
    const products: Product[] = [];

    if(product !== null) {
      products.push(product);

      this.dialog.open<AddOrEditProductComponent>(AddOrEditProductComponent, {
        data: products
      });
    } else {
      this.dialog.open<AddOrEditProductComponent>(AddOrEditProductComponent);
    };
  }

  modalDelete(product: Product | null): void {
    const products: Product[] = [];

    if (product !== null) {
      products.push(product);

      this.dialog.open<DeleteProductComponent>(DeleteProductComponent, {
        data: products,
      });
    } else {
      console.log("[Error]: não foi possível encontrar produto selecionado para excluir");
    };
  }

  filter(newTitle: string): void {
    this.title = newTitle;
  }
}
