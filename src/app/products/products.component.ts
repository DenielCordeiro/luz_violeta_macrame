import {
	AfterViewInit,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild,
	computed,
	inject,
	signal,
} from '@angular/core';
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
import {
	EMPTY_PRODUCT_FILTERS,
	ProductFilters,
	ProductFiltersComponent,
} from './product-filters/product-filters.component';

function normalizeText(value: string | undefined): string {
	return (value ?? '')
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLocaleLowerCase('pt-BR');
}

function matchesPrice(productPrice: number | undefined, minimum: number | null, maximum: number | null): boolean {
	if (minimum === null && maximum === null) return true;
	if (typeof productPrice !== 'number' || !Number.isFinite(productPrice)) return false;

	return (minimum === null || productPrice >= minimum)
		&& (maximum === null || productPrice <= maximum);
}

export function hasProductFilters(filters: ProductFilters): boolean {
	return normalizeText(filters.name) !== ''
		|| normalizeText(filters.type) !== ''
		|| normalizeText(filters.category) !== ''
		|| filters.selection !== 'all'
		|| filters.minPrice !== null
		|| filters.maxPrice !== null;
}

export function filterProducts(products: readonly Product[], filters: ProductFilters): Product[] {
	const name = normalizeText(filters.name);
	const type = normalizeText(filters.type);
	const category = normalizeText(filters.category);

	return products.filter((product) => {
		const matchesName = name === '' || normalizeText(product.name).includes(name);
		const matchesType = type === '' || normalizeText(product.type?.name).includes(type);
		const matchesCategory = category === '' || normalizeText(product.category?.name).includes(category);
		const matchesSelection = filters.selection === 'all'
			|| (filters.selection === 'selected' && product.selection === true)
			|| (filters.selection === 'not-selected' && product.selection === false);

		return matchesName
			&& matchesType
			&& matchesCategory
			&& matchesSelection
			&& matchesPrice(product.price, filters.minPrice, filters.maxPrice);
	});
}

export function mergeProductPages(currentProducts: readonly Product[], newProducts: readonly Product[]): Product[] {
	const knownIds = new Set(currentProducts.flatMap((product) => product._id ? [product._id] : []));
	const mergedProducts = [...currentProducts];

	for (const product of newProducts) {
		if (product._id && knownIds.has(product._id)) continue;

		mergedProducts.push(product);
		if (product._id) knownIds.add(product._id);
	}

	return mergedProducts;
}

@Component({
	selector: 'app-products',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		MatButtonModule,
		MatIconModule,
		MatProgressBarModule,
		ProductFiltersComponent,
	],
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.sass'],
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('scrollAnchor') public anchor!: ElementRef<HTMLElement>;
	public observer?: IntersectionObserver;

	private readonly productsService = inject(ProductsService);
	private readonly loadedProductsState = signal<Product[]>([]);
	private readonly filterValues = signal<ProductFilters>(EMPTY_PRODUCT_FILTERS);
	private loadingDelay?: ReturnType<typeof setTimeout>;

	public readonly products = this.loadedProductsState.asReadonly();
	public readonly filteredProducts = computed(() => filterProducts(this.products(), this.filterValues()));
	public readonly filtersAreActive = computed(() => hasProductFilters(this.filterValues()));

	public productId: number | undefined;
	public currentPage = 1;
	public pageSize = 6;
	public hasNextPage = true;
	public isLoading = false;
	public loadError: string | null = null;

	constructor(public dialog: MatDialog) { }

	ngOnInit(): void {
		this.loadProducts();
		this.clearProductLocalStorage();
	}

	ngAfterViewInit(): void {
		this.createObserver();
	}

	public resetAndReload(): void {
		this.loadedProductsState.set([]);
		this.currentPage = 1;
		this.hasNextPage = true;
		this.loadProducts();
	}

	public createObserver(): void {
		this.observer = new IntersectionObserver((entries) => {
			const entry = entries[0];

			if (entry.isIntersecting && !this.isLoading && this.hasNextPage) {
				this.loadNextPage();
			}
		}, {
			root: null,
			threshold: 0,
		});

		if (this.anchor?.nativeElement) {
			this.observer.observe(this.anchor.nativeElement);
		}
	}

	public loadNextPage(): void {
		if (this.hasNextPage) this.loadProducts(this.currentPage + 1);
	}

	public loadProducts(page = 1): void {
		if (this.isLoading || (!this.hasNextPage && page !== 1)) return;

		this.isLoading = true;
		this.loadError = null;

		this.productsService.getProducts(page, this.pageSize)
			.then((response: PaginatedProductsResponse) => {
				if (!response?.products || !Array.isArray(response.products.docs)) {
					throw new Error('Resposta de produtos inválida');
				}

				const docs = response.products.docs;
				this.loadedProductsState.update((currentProducts) => page === 1
					? mergeProductPages([], docs)
					: mergeProductPages(currentProducts, docs));

				this.currentPage = response.products.page || page;
				this.hasNextPage = response.products.hasNextPage
					?? (this.currentPage < (response.products.pages || 1));

				this.loadingDelay = setTimeout(() => {
					this.isLoading = false;

					if (document.body.scrollHeight <= window.innerHeight && this.hasNextPage) {
						this.loadNextPage();
					}
				}, 800);
			})
			.catch((error: unknown) => {
				console.error('Erro ao carregar produtos:', error);
				this.loadError = 'Não foi possível carregar os produtos. Tente novamente.';
				this.isLoading = false;
			});
	}

	public updateFilters(filters: ProductFilters): void {
		this.filterValues.set(filters);
	}

	public retryLoading(): void {
		this.loadProducts(this.products().length === 0 ? 1 : this.currentPage + 1);
	}

	public clearProductLocalStorage(): void {
		this.productsService.removeProductSelected();
	}

	public gettingProducts(): void {
		this.productsService.getProducts()
			.then((loadedProducts) => {
				if (!loadedProducts?.products?.docs) {
					alert('[Atenção]: Não existe nenhum produto à venda!');
				} else {
					this.loadedProductsState.set(mergeProductPages([], loadedProducts.products.docs));
				}
			})
			.catch((error: unknown) => {
				alert('ERRO: não conseguiu trazer os produtos');
				console.log(error);
			});
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
				data: product,
			});
		} else {
			console.log('[Error]: não foi possível encontrar produto selecionado para atualizar');
		}
	}

	public dialogDelete(product: Product | null): void {
		if (product !== null) {
			this.dialog.open<DeleteProductComponent>(DeleteProductComponent, {
				data: product,
			});
		} else {
			console.log('[Error]: não foi possível encontrar produto selecionado para excluir');
		}
	}

	ngOnDestroy(): void {
		this.observer?.disconnect();
		if (this.loadingDelay) clearTimeout(this.loadingDelay);
	}
}
