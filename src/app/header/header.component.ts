import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Product } from '../interfaces/product.interface';
import { User } from '../interfaces/user.interface';
import { CartService } from '../services/cart/cart.service';
import { MenuComponent } from './menu/menu.component';
import { StartComponent } from './login/start/start.component';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		MenuComponent
	],
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.sass'],
})

export class HeaderComponent implements OnInit {
	@ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef; // Captura o local para inserir o template
	@ViewChild('loginTemplate') loginTemplate!: TemplateRef<any>; // Captura o template em si

	cart: Product[] = [];
	profile: User = {};
	productsQuantity: number = 0;
	userId: string | undefined = undefined;

	constructor(
		public route: Router,
		public cartService: CartService,
		public dialog: MatDialog,
	) { }

	ngOnInit(): void {
		this.gettingProductsInCart();
	}

	gettingProductsInCart(): void {
		this.cartService.productsInCart.subscribe(products => {
			this.cart = products;
			this.productsQuantity = this.cart.length;
			console.log("produtos no carrinho: ", products);
		});
	}

	openCart(): void {
		this.getUserId();

		if (this.userId == undefined) {
			this.container.clear(); // Limpa o container antes de inserir para não duplicar
			this.container.createEmbeddedView(this.loginTemplate); // Cria a view baseada no template
		} else {

			console.log(this.cart.length);

			if (this.cart.length > 0) {
				this.route.navigateByUrl("/cart/" + this.userId)
			} else {
				alert('[ Atenção ! ]: Carrinho vazio :)');
			}
		}
	}

	getUserId(): string | undefined {
		this.profile = JSON.parse(localStorage.getItem('profile') || '{}');

		this.userId = this.profile._id;

		return this.userId;
	}

	startingLogin(): void {
		this.dialog.open<StartComponent>(StartComponent);
		this.closeTemplate();
	}

	closeTemplate(): void {
		this.container.remove(0);
	}
}
