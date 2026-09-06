import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { lastValueFrom } from "rxjs";
import { BaseCrud } from "src/app/interfaces/base-crud.interface";
import { environment } from "src/environments/environment";
import { PaginatedProductsResponse, Product } from './../../../interfaces/product.interface';
import { BaseProduct } from "./base-products.interface";

export abstract class CrudProductsService<T extends BaseCrud> {
	http!: HttpClient;
	localStorage!: LocalStorageService;
	route!: string;
	header: any = this.buildHeader();
	products: Product[] = [];
	productSelected!: Product;

	constructor(
		http: HttpClient,
		localStorage: LocalStorageService,
		route: string,
	) {
		this.http = http;
		this.localStorage = localStorage;
		this.route = environment.api + route;
	}

	public buildHeader(): HttpHeaders {
		const token = localStorage.getItem('session');
		const headers = new HttpHeaders({
			token: `Bearer ${token}`,
		});

		return headers;
	}

	public getProducts(page: number = 1, limit: number = 9): Promise<PaginatedProductsResponse> {
		return lastValueFrom(this.http.get<PaginatedProductsResponse>(`${this.route}?page=${page}&limit=${limit}`, { headers: this.header }))
			.then(products => {
				return this.handleResponse(products) as unknown as PaginatedProductsResponse;
			})
			.catch(error => this.handleResponse(error) as unknown as PaginatedProductsResponse);
	}

	public addProductLocalStorage(product: Product): void {
		localStorage.setItem('selectedProduct', JSON.stringify(product));
	}

	public getProductLocalStorage(): Promise<Product | null> {
		const productInLocalStorage = localStorage.getItem('selectedProduct');

		if (productInLocalStorage !== null) {
			return Promise.resolve(JSON.parse(productInLocalStorage));
		}

		return Promise.resolve(null);
	}


	public async getProduct(productId: string): Promise<Product> {
		try {
			const product = await lastValueFrom(this.http.get<Product>(`${this.route}/${productId}`, { headers: this.header }));

			this.productSelected = product;
			this.addProductLocalStorage(this.productSelected);

			return this.productSelected;
		} catch (error) {
			throw new Error(`[ERRO!] Produto não encontrado! Id enviado (${productId}), mas a API retornou erro.`);
		}
	}

	public removeProductSelected(): void {
		this.products.pop();
		localStorage.removeItem('selectedProduct');
		localStorage.removeItem('shipping');
	}

	public createProduct(product: FormData): Promise<T> {
	  return lastValueFrom(this.http.post<BaseProduct<T>>(this.route, product, { headers: this.header }))
	    .then(result => {
	    return this.handleResponse(result) as unknown as T;
	  });
	}

	public updateProduct(product: FormData, productId: string | undefined): Promise<T> {
		return lastValueFrom(this.http.put<BaseProduct<T>>(`${this.route}/${productId}`, product, { headers: this.header }))
			.then(result => {
				return this.handleResponse(result) as unknown as T;
			})
			.catch(error => {
				return this.handleResponse(error) as unknown as T;
			})
	}

	public deleteProduct(productId: string): Promise<string> {
		return lastValueFrom(this.http.delete<BaseProduct<T>>(`${this.route}/${productId}`, { headers: this.header }))
			.then(result => {
				return this.handleResponse(result) as unknown as string;
			});
	}

	public handleResponse(response: PaginatedProductsResponse | BaseProduct<T> | any): PaginatedProductsResponse | BaseProduct<T> {
		if (response) {
			return response;
		} else {
			throw new Error("Api 200, mas success falso!");
		}
	}
}
