import { Component } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { Router, RouterModule } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { LoginComponent } from '../../login/login.component';

@Component({
    selector: 'app-desktop-menu',
    standalone: true,
    imports: [
        RouterModule,
        LoginComponent,
    ],
    templateUrl: './desktop-menu.component.html',
    styleUrls: ['./desktop-menu.component.sass'],
})
export class DesktopMenuComponent {
    isOpen: boolean = false;
    modalLogout: boolean = false;
    administrator: boolean = false;
    userId: number = 0;

    constructor(
        private userService: UsersService,
        public menu: MenuComponent,
        public route: Router,
    ) {
        this.getLogin();
    }

    changeMenuProducts(): void {
        if (this.isOpen == false) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }
    }

    getLogin(): void {
        const id = localStorage.getItem('user_id');

        if (id !== null) {
            this.userId = JSON.parse(id);
        } else {
            console.log('Necessário fazer login');
        }

        this.administrator = this.userService.isAdministrator();
    }

    modalLogoutIsOpen(): void {
        if (this.modalLogout == false) {
            this.modalLogout = true;
        } else {
            this.modalLogout = false;
        }
    }

    isLogout(): void {
        const noAction: string = 'noAction';

        this.userService.logout();
        this.closeMenu(noAction);
    }

    closeMenu(nextUrl: string): void {
        let activeRoute = this.route.url;

        if (nextUrl == 'noAction') {
            this.menu.changeIconBurguer();
        } else if (nextUrl == activeRoute) {
            console.log('Você já está nesta página!');
        } else {
            this.menu.changeIconBurguer();
        }
    }
}
