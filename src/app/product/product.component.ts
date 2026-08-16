import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { StorageService } from '../services/storage/storage.service';
import { ProductsService } from './../services/products/products.service';
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
	public searchForm!: FormGroup;

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
	public productIsInCart: boolean = false;
	public productAddedToCart: boolean = true;

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

	public getUserProfile(): void {
		try {
			this.userProfile = this.storage.get('profile', {});
		} catch (error) {
			console.error('Nenhum perfil encontrado:', error);
		}
	}

	public buildingForm(): void {
		this.searchForm = this.formBuilder.group({
			"postalCode": [null],
		});
	}

	public getCurrentShipping(): void {
		try {
			const shipping = localStorage.getItem('shipping');

			if (shipping) {
				this.sale.shipping = JSON.parse(shipping);
			} else {
				console.error('Nenhum frete encontrado no localStorage.');
			}
		} catch (error) {
			console.error('Nenhum frete encontrado:', error);
		}
	}

	public searchShipping(): void {
		const postalCodeNumber = this.searchForm?.value;
		this.postalCode = String(postalCodeNumber?.postalCode)

		if (this.postalCode == 'null') {

			alert("[Atenção]: Precisa digitar algum número de CEP!");

		} else {
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
		const loadProductsInCart = this.cartService.productsInCart;		

		loadProductsInCart.subscribe((products: Product[]) => {
			this.productsInCart = products;
			console.log('Produtos no carrinho: ', this.products);
			
			// this.productIsInCart = this.productsInCart.some(item => item._id === this.product._id); // Verifica se o produto está no carrinho

			if (this.productIsInCart) {
				this.productAddedToCart = true;
			} else {
				this.productAddedToCart = false;
			}
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
				data: { productId: id },
			});
		} else {
			console.error('ID do produto não encontrado para excluir.');
		}
	}

	ngOnDestroy(): void {
		this.productsService.removeProductSelected();
	}
}
