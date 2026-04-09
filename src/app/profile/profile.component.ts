import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../guards/auth.service';

import { User } from '../interfaces/user.interface'; 

import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

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

	constructor(private dialog: MatDialog) {
		this.getMyUser();
	};

	public getMyUser(): void {
		this.myProfile = this.authService.getUserProfile();

		if (this.myProfile == null) {
			console.log('usuários não existe no LocalStorage');
		} else {
			this.firstName = this.myProfile.name?.split(' ')[0];
		}
	};

	public updatingProfile(formName: string): void {
		this.dialog.open<UpdateProfileComponent>(UpdateProfileComponent, {
			data: {
				profile: this.myProfile,
				formType: formName,
			},
		});
	}

	public leaving(): void {
		this.authService.logout();
	};
	
	public openCart(): void {};

	public deletingAccount(): void {
		this.dialog.open<DeleteProfileComponent>(DeleteProfileComponent, {
			data: {
				profileName: this.myProfile?.name,
				profileId: this.myProfile?._id,
			}
		});
	};
}
