import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ProductsService } from '../services/products/products.service';

import { Product, PaginatedProductsResponse } from '../interfaces/product.interface';

import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';


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
    public pageSize: number = 6;

	public title: string = 'Trabalhos disponíveis';
	public hasNextPage: boolean = true;
	public isLoading: boolean = false;

	constructor(public dialog: MatDialog) { }

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

	public createObserver(): void {
		// Cria um IntersectionObserver para detectar quando o usuário chega ao final da lista de produtos
		this.observer = new IntersectionObserver((entries) => {
			const entry = entries[0]; // Verifica se o elemento âncora está visível na tela e se não está carregando produtos e se há mais páginas para carregar

			if (entry.isIntersecting && !this.isLoading && this.hasNextPage) {
				this.loadProducts(this.currentPage + 1); // Carrega a próxima página de produtos
			}
		}, {
			root: null,
        	threshold: 0 // O callback será chamado assim que qualquer parte do elemento âncora estiver visível
		});

		if (this.anchor?.nativeElement) {
			this.observer.observe(this.anchor.nativeElement); // Inicia a observação do elemento âncora
		}
	}

	public loadProducts(page: number = 1): void {
		if (this.isLoading || (!this.hasNextPage && page !== 1)) return;

		this.isLoading = true;

		this.productsService.getProducts(page, this.pageSize)
			.then((response: PaginatedProductsResponse) => {
				if (!response || !response.products) {
					this.isLoading = false;
					return;
				}

				const docs = response.products.docs;
				
				if (page === 1) {
					this.products = docs;
				} else {
					this.products = [...this.products, ...docs];
				}

				this.currentPage = response.products.page || page;
				this.hasNextPage = response.products.hasNextPage ?? (this.currentPage < (response.products.pages || 1));
				

				// Pequeno atraso para o usuário visualizar o indicador de progresso renderizando os novos cards
				setTimeout(() => {
					this.isLoading = false;

					// Se a tela ainda não tem scroll vertical, carrega a próxima
					if (document.body.scrollHeight <= window.innerHeight && this.hasNextPage) {
						this.loadProducts(this.currentPage + 1);
					}
				}, 800);
			})
			.catch(error => {
				console.error('Erro ao carregar produtos:', error);
				this.isLoading = false;
			});
	}

	public clearProductLocalStorage(): void {
		this.productsService.removeProductSelected();
	}

	public gettingProducts(): void {
		this.productsService.getProducts()
			.then(loadedProducts => {
				if (loadedProducts == null || loadedProducts == undefined) {
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

	public dialogCreate(): void {
		this.dialog.open<CreateProductComponent>(CreateProductComponent);
	}

	public dialogUpdate(product: Product | null): void {
		if (product !== null) {
			this.dialog.open<UpdateProductComponent>(UpdateProductComponent, {
				data: product
			});
		} else {
			console.log("[Error]: não foi possível encontrar produto selecionado para atualizar");
		}
	}

	public dialogDelete(product: Product | null): void {
		if (product !== null) {
			this.dialog.open<DeleteProductComponent>(DeleteProductComponent, {
				data: product,
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
