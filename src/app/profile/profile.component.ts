import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../guards/auth.service';

import { User } from '../interfaces/user.interface'; 

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent {
	public myProfile:  User | null = null;
	private authService: AuthService = inject(AuthService);
	public firstName: string | undefined = undefined;

	constructor() {
		this.getMyUser();
	};

	public getMyUser(): void {
		this.myProfile = this.authService.getUserProfile();

		if (this.myProfile == null) {
			console.log('usuários não existe no LocalStorage');
		} else {
			this.firstName = this.myProfile.name?.split(' ')[0];
			console.log('Usuário: ', this.myProfile);
		}
	};

	public updatingProfile(): void {}

	public leaving(): void {
		this.authService.logout();
	};

	public openAddressDialog(): void {};

	public openCart(): void {};

	public deletingAccount(): void {};
}
