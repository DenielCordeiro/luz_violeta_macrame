import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../services/cart/cart.service';
import { Product } from 'src/app/interfaces/product.interface';
import { Sale } from '../interfaces/sale.interface';
import { User } from '../interfaces/user.interface';
import { PaymentsComponent } from './payments/payments.component';

@Component({
	selector: 'app-cart',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.sass'],
})
export class CartComponent implements OnInit {
	productsInCart: Product[] = [];
	buildedSale: Sale = {};
	userProfile: User = {};
	finalValue: number = 0;

	constructor(
		private cartService: CartService,
		public dialog: MatDialog
	) { }

	ngOnInit(): void {
		this.getProductsInCart();
	}

	getProductsInCart(): void {
		this.cartService.getProductsInCart()
			.then((products: Product[]) => {
				this.productsInCart = products;
				this.calculateFinalValue(this.productsInCart);
			});
	}

	calculateFinalValue(products: Product[]): number {
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


	cartCleaning(): void {
		this.cartService.clearCart();
		this.productsInCart = [];
		this.finalValue = 0;
	}

	savingCart(): void { }

	completePurchase(): void {
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
}
