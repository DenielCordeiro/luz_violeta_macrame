import { Component, inject } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { AuthService } from '../guards/auth.service';

@Component({
	selector: 'app-users',
	standalone: true,
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent {
	public myProfile:  User | null = null;
	private authService: AuthService = inject(AuthService);

	constructor() {
		this.getMyUser();
	};

	public getMyUser(): void {
		this.myProfile = this.authService.getUserProfile();

		if (this.myProfile == null) {
			console.log('usuários não existe no LocalStorage');
		} else {
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
