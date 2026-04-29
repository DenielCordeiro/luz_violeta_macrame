import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ProductsService } from '../services/products/products.service';

import { Product } from '../interfaces/product.interface';

import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';

import { PRODUCTS_MOCK } from './products.mock';

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
  @ViewChild('scrollAnchor') public anchor!: ElementRef;
  public observer!: IntersectionObserver;

  private productsService: ProductsService = inject(ProductsService);

  public products: Product[] = [];

  public productId: number | undefined;
  public currentPage: number = 1;
  public pageSize: number = 9;

  public title: string = 'Trabalhos disponíveis';
  public hasNextPage: boolean = true;
  public isLoading: boolean = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
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

  public resetAndReload(): void {
    this.products = [];
    this.currentPage = 1;
    this.hasNextPage = true;
    this.loadProducts();
  }

  public createObserver() {
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

  public loadProducts(page: number = 1): void {
    if (this.isLoading || !this.hasNextPage) return;

    this.isLoading = true;

    setTimeout(() => {
      const allProducts = PRODUCTS_MOCK;

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

  public clearProductLocalStorage(): void {
    this.productsService.removeProductSelected();
  }

  public gettingProducts(): void {
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

  public setProductInLocalStorage(product: Product): void {
    this.productsService.addProductLocalStorage(product);
  }

  public modalCreate(product: Product | null): void {
    const products: Product[] = [];

    if(product !== null) {
      products.push(product);

      this.dialog.open<UpdateProductComponent>(UpdateProductComponent, {
        data: products
      });
    } else {
      this.dialog.open<CreateProductComponent>(CreateProductComponent);
    };
  }

  public modalDelete(product: Product | null): void {
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

  public filter(newTitle: string): void {
    this.title = newTitle;
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
