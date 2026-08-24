import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { StorageService } from '../services/storage/storage.service';
import { ProductsService } from '../services/products/products.service';
import { MelhorEnvioService } from '../services/melhor-envio/melhor-envio.service';
import { CartService } from '../services/cart/cart.service';

import { Product } from '../interfaces/product.interface';
import { Shipping } from '../interfaces/shipping.interface';
import { Sale } from '../interfaces/sale.interface';
import { User } from '../interfaces/user.interface';

import { UpdateProductComponent } from '../products/update-product/update-product.component';
import { DeleteProductComponent } from '../products/delete-product/delete-product.component';

@Component({
	selector: 'app-product',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatIconModule
	],
	templateUrl: './product.component.html',
	styleUrl: './product.component.sass',
})
export class ProductComponent implements OnInit, OnDestroy {
	public freightForm!: FormGroup;

	private storage: StorageService = inject(StorageService);
	private productsService: ProductsService = inject(ProductsService);
	private melhorEnvio: MelhorEnvioService = inject(MelhorEnvioService);
	private cartService: CartService = inject(CartService);

	public productsInCart: Product[] = [];
	public shippings: Shipping[] = [];
	public products: Product[] = [];

	public product: Product = {};
	public sale: Sale = {};
	public userProfile: User = {};

	public postalCode: string = '';
	public productsQuantity: number = 1;
	public productAddedToCart: boolean = false;

	constructor(
		public route: Router,
		private formBuilder: FormBuilder,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.getProductSelected();
		this.getCurrentShipping();
		this.buildingForm();
		this.checkIfProductIsInCart();
	}

	public getProductSelected(): void {
		try {
			this.product = this.productsService.getProductSelected();
		} catch (error) {
			console.error({
				"message:": "Não foi possível buscar o produto do serviço.",
				"fail: ": error,
			})
		}

		if (!this.product) {
			console.error('Nenhum produto selecionado!');
			return;
		} else {
			this.products.push(this.product);
		}
	}

	public getUserProfile(): User {
		let userProfile: User = {}

		try {
			userProfile = this.storage.get('profile', {});
		} catch (error) {
			console.error('Nenhum perfil encontrado:', error);
		}

		return userProfile;
	}

	public buildingForm(): void {
		this.freightForm = this.formBuilder.group({
			"postalCode": [null],
		});
	}

	public getCurrentShipping(): void {
		this.userProfile = this.getUserProfile();

		if (this.userProfile !== undefined && this.userProfile.postalCode !== undefined) {
			if (this.userProfile.postalCode !== null && this.userProfile.postalCode !== '') {
				this.searchShipping(this.userProfile.postalCode);
			} else {
				console.error("Cep diferente de undefined, mas vazio ou nulo ou vazio.");
			}
		} else {
			console.error("Falha, CEP [UNDEFINED]");
		}	
	}

	public searchShipping(postalCode: number | string | null | undefined): void {
		if (postalCode == null || postalCode == '') {
			console.error("[Atenção]: Precisa digitar algum número de CEP!");

		} else if (postalCode == undefined) {
			console.error("Falha, CEP [UNDEFINED]");

		} else {
			this.postalCode = String(postalCode).replace(/\D/g, ''); // Remove caracteres não numéricos do CEP
			const postalCodeNumber = { postalCode: Number(this.postalCode) }; // Converte o CEP para número

			this.melhorEnvio.getShipping(this.postalCode)
				.then(result => {
					this.sale.shipping = {
						company: {
							name: result[0]?.company?.name,
							picture: result[0]?.company?.picture
						},
						price: Number(result[0]?.price),
						postalCode: postalCodeNumber?.postalCode
					};

					localStorage.setItem('shipping', JSON.stringify(this.sale.shipping));
					this.shippings = result;
				})
				.catch(error => {
					console.log(error);
				})
		};
	};

	public changeQuantity(action: string): number {
		if (action === 'add') {
			this.productsQuantity++;
		} else if (action === 'remove' && this.productsQuantity > 1) {
			this.productsQuantity--;
		}
		return this.productsQuantity;
	}

	public addingToCart(): void {
		this.cartService.addToCart(this.product)
			.then(() => {
				this.checkIfProductIsInCart();
			})
			.catch(error => {
				console.error('Erro ao adicionar produto ao carrinho:', error);
			});
	}

	public removingProductFromCart(): void {
		this.cartService.removeProductFromCart(this.product)
			.then(() => {
				this.checkIfProductIsInCart();
			})
			.catch(error => {
				console.error('Erro ao remover produto do carrinho:', error);
			});
	}

	public checkIfProductIsInCart(): void {
		const loadProductsInCart = this.cartService.getProductsInCart();

		loadProductsInCart.then((products: Product[]) => {
			this.productsInCart = products;

			if (this.productsInCart.some(item => item._id === this.product._id)) {
				this.productAddedToCart = true;
			} else {
				this.productAddedToCart = false;
			}
		}).catch(error => {
			console.error('Erro ao obter produtos do carrinho:', error);
		});
	}

	public goToCart(): void {
		this.route.navigate(['/cart']);
	}

	public updateModal(product: Product | undefined): void {
		if (product) {
			this.dialog.open<UpdateProductComponent>(UpdateProductComponent, {
				data: product,
			});
		} else {
			console.error('ID do produto não encontrado para atualização.');
		}
	}

	public deleteModal(id: string | undefined): void {
		if (id) {
			this.dialog.open<DeleteProductComponent>(DeleteProductComponent, {
				data: this.product,
			});

			this.dialog.afterAllClosed.subscribe(() => {
				this.productsService.removeProductSelected();
				this.route.navigate(['/products']);
			});
		} else {
			console.error('ID do produto não encontrado para excluir.');
		}
	}

	ngOnDestroy(): void {
		this.productsService.removeProductSelected();
	}
}
