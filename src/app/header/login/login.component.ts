import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/guards/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user.interface';
import { StartComponent } from './start/start.component';

@Component({
	selector: 'app-login',
	standalone: true,
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.sass'],
	imports: [RouterLink],
})
export class LoginComponent implements OnInit {
	authService: AuthService = inject(AuthService);
	user: User | null = null;
	isConnected: boolean = false;

	constructor(
		public route: ActivatedRoute,
		public dialog: MatDialog,
	) { }

	ngOnInit(): void {
		this.verifyIsConnected();
	}

	verifyIsConnected(): boolean {
		this.user = this.authService.getUserProfile();

		if (this.user !== null) {
			return this.isConnected = false;
		} else {
			return this.isConnected = true;
		}
	}

	loginDialog(): void {
		this.dialog.open<StartComponent>(StartComponent);
	}
}
