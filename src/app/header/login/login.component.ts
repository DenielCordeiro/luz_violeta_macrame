import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from 'src/app/guards/auth.service';
import { MenuService } from 'src/app/services/menu/menu.service';

import { User } from 'src/app/interfaces/user.interface';
import { StartComponent } from './start/start.component';


@Component({
	selector: 'app-login',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
	private authService: AuthService = inject(AuthService);
	private menuService: MenuService = inject(MenuService);

	public user: User | null = null;
	public isConnected: boolean = false;

	public firstName: string | undefined = undefined;
	public currentRoute: string | undefined = undefined;

	constructor(
		public router: Router,
		public dialog: MatDialog,
	) { }

	ngOnInit(): void {
		this.verifyIsConnected();
		this.currentRoute = this.router.url;
	}

	verifyIsConnected(): boolean {
		this.user = this.authService.getUserProfile();

		if (this.user) {
			if (this.user?.name) {
				this.firstName = this.user.name.split(' ')[0];
			} else {
				this.firstName = undefined;
			}

			this.isConnected = false;

			return this.isConnected;
		} else {
			this.isConnected = true;

			return this.isConnected;
		}
	}

	loginDialog(): void {
		if (this.isConnected == false) {
			console.log('Usuário já está conectado!');	
		} else {
			this.dialog.open<StartComponent>(StartComponent);
		}
	}

	closingMenu(url: string): void {
		if (this.currentRoute) {
			this.menuService.saveCurrentUrl(this.currentRoute);
		} else {
			console.log("Rota anterior não adicionada!");
			
		}
		
		this.menuService.closeMenu(url);
    }
}
