import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { lastValueFrom } from "rxjs";
import { BaseCrud } from "src/app/interfaces/base-crud.interface";
import { environment } from "src/environments/environment";
import { Product } from './../../../interfaces/product.interface';
import { BaseProduct } from "./base-products.interface";

export abstract class CrudProductsService<T extends BaseCrud> {
  http!: HttpClient;
  localStorage!: LocalStorageService;
  route!: string;
  header: any = this.buildHeader();
  products: Product[] = [];

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

  public getProducts(): Promise<BaseProduct<T>>{
    return lastValueFrom(this.http.get<BaseProduct<T>>(this.route))
      .then(products => {
        return this.handleResponse(products) as unknown as BaseProduct<T>;
      });
  }

  public addProductLocalStorage(product: Product): void {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
  }

  public getProductSelected(): Product {
    const productInLocalStorage = localStorage.getItem('selectedProduct');   

    if (productInLocalStorage !== null) {
      const product = JSON.parse(productInLocalStorage)
      this.products.push(product)
    } else {
      console.error({ "message": "[ERRO!] Produto não está sendo carregado do LocalStorage" })
    }

    return this.products[0];
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

  public updateProduct(product: FormData, productId: number | undefined): Promise<T> {
    return lastValueFrom(this.http.put<BaseProduct<T>>(`${this.route}/${productId}`, product, { headers: this.header }))
      .then(result => {
        return this.handleResponse(result) as unknown as T;
      })
      .catch (error => {
        return this.handleResponse(error) as unknown as T;
      })
  }

  public deleteProduct(productId: string): Promise<boolean> {
    return lastValueFrom(this.http.delete<BaseProduct<T>>(`${this.route}/${productId}`, { headers: this.header }))
      .then(result => {
        return this.handleResponse(result) as unknown as true;
      });
  }

  public handleResponse(response: BaseProduct<T>) {
    if(response) {
      return response;
    } else {
      throw new Error("Api 200, mas success falso!");
    }
  }
}
