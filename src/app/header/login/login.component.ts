import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
	authService: AuthService = inject(AuthService);
	menuService: MenuService = inject(MenuService);
	user: User | null = null;
	isConnected: boolean = false;
	firstName: string | undefined = undefined;

	constructor(
		public route: ActivatedRoute,
		public dialog: MatDialog,
	) { }

	ngOnInit(): void {
		this.verifyIsConnected();
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
        this.menuService.closeMenu(url);
    }
}
