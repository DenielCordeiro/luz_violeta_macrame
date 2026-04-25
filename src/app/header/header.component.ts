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
		this.cartService.productsInCart.subscribe(() => {
			const cart = localStorage.getItem('cart');
			const productsIncart = JSON.parse(cart || '[]');

			this.productsQuantity = productsIncart.length;

			console.log(this.productsQuantity);
		});		
	}

	openCart(): void {}
}
