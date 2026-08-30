import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductsService } from '../services/products/products.service';
import { CartService } from '../services/cart/cart.service';

import { Product } from 'src/app/interfaces/product.interface';
import { Sale } from '../interfaces/sale.interface';
import { User } from '../interfaces/user.interface';

import { PaymentsComponent } from './payments/payments.component';

@Component({
	selector: 'app-cart',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		RouterModule,
	],
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.sass'],
})
export class CartComponent implements OnInit {
	private productsService: ProductsService = inject(ProductsService);
	private cartService: CartService = inject(CartService);

	public productsInCart: Product[] = [];

	public buildedSale: Sale = {};
	public userProfile: User = {};

	public finalValue: number = 0;

	constructor(
		public dialog: MatDialog,
		private route: Router,
	) {}

	ngOnInit(): void {
		this.getProductsInCart();
	}

	public getProductsInCart(): void {
		this.cartService.getProductsInCart()
			.then((products: Product[]) => {
				this.productsInCart = products;
				this.calculateFinalValue(this.productsInCart);
			});
	}

	public calculateFinalValue(products: Product[]): number {
		const total = products.reduce((accumulator, product) => {
			const productPrice = product.price || 0;

			return accumulator + productPrice;
		}, 0);

		this.finalValue = total;

		return this.finalValue;
	}

	public removingProductFromCart(product: Product): void {
		this.cartService.removeProductFromCart(product)
			.then(() => {
				this.getProductsInCart();
			})
			.catch(error => {
				console.error('Erro ao remover produto do carrinho:', error);
			});
	}


	public cartCleaning(): void {
		this.cartService.clearCart();
		this.productsInCart = [];
		this.finalValue = 0;
	}

	public savingCart(): void { }

	public completePurchase(): void {
		this.userProfile = this.cartService.getUserProfile();

		this.buildedSale = {
			products: [...this.productsInCart],
			userProfile: {
				_id: this.userProfile._id,
				name: this.userProfile.name,
				email: this.userProfile.email,
				cellphone: this.userProfile.cellphone,
				cpf: this.userProfile.cpf,
			},
			sold: true,
			productsQuantity: this.productsInCart.length,
			finalValue: this.finalValue,
		}

		this.dialog.open<PaymentsComponent>(PaymentsComponent, {
			data: this.buildedSale
		});
	}

	public goToProductPage(product: Product): void {
		this.productsService.addProductLocalStorage(product);
		this.route.navigate(['/product', product._id]);
	}
}
