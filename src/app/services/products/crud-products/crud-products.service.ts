import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { lastValueFrom } from "rxjs";
import { BaseCrud } from "src/app/interfaces/base-crud.interface";
import { environment } from "src/environments/environment";
import { PaginatedProductsResponse, Product } from './../../../interfaces/product.interface';
import { BaseProduct } from "./base-products.interface";
import { Characteristics } from "src/app/interfaces/characteristics";

export abstract class CrudProductsService<T extends BaseCrud> {
    http!: HttpClient;
    localStorage!: LocalStorageService;
    route!: string;
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
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
            token: `Bearer ${token}`
        });
    }

    public async getProducts(page: number, limit: number): Promise<PaginatedProductsResponse> {
        const products = await lastValueFrom(
            this.http.get<PaginatedProductsResponse>(`${this.route}?page=${page}&limit=${limit}`, { headers: this.buildHeader() })
        );
        return this.handleResponse(products) as unknown as PaginatedProductsResponse;
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
            const product = await lastValueFrom(
                this.http.get<Product>(`${this.route}/${productId}`, { headers: this.buildHeader() })
            );

            this.productSelected = product;
            this.addProductLocalStorage(this.productSelected);

            return this.productSelected;
        } catch (error) {
            throw new Error(`[ERRO!] Produto não encontrado! Id enviado (${productId}), mas a API retornou erro.`);
        }
    }

    public async getCharacteristics(): Promise<Characteristics> {
        return await lastValueFrom(
            this.http.get<Characteristics>(`${this.route}/characteristics`, { headers: this.buildHeader() })
        );
    }

    public removeProductSelected(): void {
        this.products.pop();
        localStorage.removeItem('selectedProduct');
        localStorage.removeItem('shipping');
    }

    public async filterProducts(categories: string[], types: string[]): Promise<PaginatedProductsResponse> {
        let params = new HttpParams();

        categories.forEach(category => {
            params = params.append('categories', category);
        });

        types.forEach(type => {
            params = params.append('types', type);
        });

        const products = await lastValueFrom(
            this.http.get<PaginatedProductsResponse>(`${this.route}/filter`, { 
                headers: this.buildHeader(),
                params: params
            })
        );

        return this.handleResponse(products) as unknown as PaginatedProductsResponse;
    }

    public async createProduct(product: FormData): Promise<T> {
        const result = await lastValueFrom(
            this.http.post<BaseProduct<T>>(this.route, product, { headers: this.buildHeader() })
        );
        return this.handleResponse(result) as unknown as T;
    }

    public async updateProduct(product: FormData, productId: string | undefined): Promise<T> {
        const result = await lastValueFrom(
            this.http.put<BaseProduct<T>>(`${this.route}/${productId}`, product, { headers: this.buildHeader() })
        );
        return this.handleResponse(result) as unknown as T;
    }

    public async deleteProduct(productId: string): Promise<string> {
        const result = await lastValueFrom(
            this.http.delete<BaseProduct<T>>(`${this.route}/${productId}`, { headers: this.buildHeader() })
        );
        return this.handleResponse(result) as unknown as string;
    }

    public handleResponse(response: PaginatedProductsResponse | BaseProduct<T> | any): PaginatedProductsResponse | BaseProduct<T> {
        if (response) {
            return response;
        } else {
            throw new Error("Api 200, mas success falso!");
        }
    }
}