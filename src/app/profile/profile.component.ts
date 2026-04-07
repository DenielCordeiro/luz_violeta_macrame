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
	public myProfile!: User;
	private authService: AuthService = inject(AuthService);

	constructor() { }

	public getMyUser(): User {
		return this.myProfile;
	};

	public leaving(): void {
		this.authService.logout();
	}
}
