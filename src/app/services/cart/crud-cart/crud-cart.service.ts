import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { BaseAPI } from "src/app/interfaces/base-api.interface";
import { BaseCrud } from "src/app/interfaces/base-crud.interface";
import { Product } from "src/app/interfaces/product.interface";
import { environment } from "src/environments/environment";
import { User } from "src/app/interfaces/user.interface";
import { Sale } from "src/app/interfaces/sale.interface";

export abstract class CrudCartService<T extends BaseCrud> {
	http!: HttpClient;
	route: string = environment.api;
	private cartSubject = new BehaviorSubject<Product[]>([]);;
	productsInCart = this.cartSubject.asObservable();
	products: Product[] = [];
	profile: User = {};

	constructor(
		httpClient: HttpClient,
	) {
		this.http = httpClient;
	}

	private get headers(): HttpHeaders {
		const token = localStorage.getItem('session');

		return new HttpHeaders({
			'Authorization': `Bearer ${token}`,
		});
	}

	public addToCart(product: Product): Promise<Product[]> {
		this.products = this.products || [];

		const productExists = this.products.find(item => item._id === product._id);

		if (productExists) {
			console.warn({ message: '[OPA!]: Produto já está no carrinho!' });
		} else {
			this.products.push(product);

			localStorage.setItem('cart', JSON.stringify(this.products));
			this.cartSubject.next(this.products);
		}

		return Promise.resolve(this.products);
	}

	public removeProductFromCart(product: Product): Promise<Product[]> {
		const products = this.getProductsInCart();

		products.then(productsInCart => {

			if (productsInCart.length === 0) {
				console.warn({ message: 'Carrinho vazio, não há produtos para remover!' });
			} else {
				this.products = productsInCart.filter(item => item._id !== product._id);
				localStorage.setItem('cart', JSON.stringify(this.products));
				this.cartSubject.next(this.products);
			}
		});
		
		return Promise.resolve(this.products);
	}

	public getProductsInCart(): Promise<Product[]> {
		const profileUser = this.getUserProfile();
		const cartLocal = this.getLocalCartProducts() || [];

		if (profileUser.productsCart !== undefined) {
			const mergedProducts = [...(profileUser.productsCart || []), ...cartLocal];

			this.products = mergedProducts.filter((value, index, self) => {
				index === self.findIndex((product) => product._id === value._id)
			});			
		} else if (profileUser.productsCart == undefined && cartLocal.length > 0) {
			this.products = cartLocal;
		} else {
			this.products = [];
		}

		return Promise.resolve(this.products);
	}

	public getUserProfile(): User {
		const localLoadingUser: string | null = localStorage.getItem('profile');

		if (localLoadingUser !== null) {
			this.profile = JSON.parse(localLoadingUser);
		}

		return this.profile;
	}

	public getLocalCartProducts(): Product[] {
		const localData = localStorage.getItem('cart');

		if (localData == null) {
			return [];
		} else {
			try {
				return JSON.parse(localData);
			} catch (e) {
				console.error("Erro ao ler carrinho do localStorage", e);
				return [];
			}
		}
	}

	public saveCart(productsInCart: Product[], user_id: any): Promise<T> {
		return lastValueFrom(this.http.put<BaseAPI<T>>(`${this.route}/save_cart/${user_id}`, {
			products: productsInCart
		}, {
			headers: this.headers
		}))
		.then(result => this.handleResponse(result) as unknown as T);
	}

	public clearCart(): Promise<T> {
		localStorage.removeItem('cart');
		this.profile = this.getUserProfile();

		return lastValueFrom(this.http.put<BaseAPI<T>>(`${this.route}/clear_cart/${this.profile._id}`, this.products))
			.then(result => {
				return this.handleResponse(result) as unknown as T;
			})
			.catch(error => {
				return this.handleResponse(error) as unknown as T;
			});
	}

	public generatePix(PIXData: {}): Promise<T> {
		return lastValueFrom(this.http.post<BaseAPI<T>>(`${this.route}/payments/pix`, PIXData))
			.then(result => {
				return this.handleResponse(result) as unknown as T;
			})
			.catch(error => {
				return this.handleResponse(error) as unknown as T;
			});
	}

	public buyProduct(buildedSale: Sale): void {
		console.log("Vocë comprou: ", buildedSale);

	}

	public handleResponse(response: BaseAPI<T>) {
		if (response) {
			return response;
		} else {
			throw new Error("Api 200, mas success falso!");
		}
	}
}
