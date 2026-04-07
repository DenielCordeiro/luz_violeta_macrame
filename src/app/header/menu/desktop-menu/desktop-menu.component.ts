import { Component, inject } from '@angular/core';
import { LoginComponent } from '../../login/login.component';
import { MenuService } from 'src/app/services/menu/menu.service';
import { AuthService } from 'src/app/guards/auth.service';

@Component({
    selector: 'app-desktop-menu',
    standalone: true,
    imports: [LoginComponent],
    templateUrl: './desktop-menu.component.html',
    styleUrls: ['./desktop-menu.component.sass'],
})
export class DesktopMenuComponent {
    authService: AuthService = inject(AuthService);
    menuService: MenuService = inject(MenuService);
    isOpen: boolean = false;
    modalLogout: boolean = false;
    administrator: boolean = false;
    userId: number = 0;

    constructor() {
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

        this.authService.logout();
        this.closingMenu(noAction);
    }

    closingMenu(url: string): void {
        this.menuService.closeMenu(url);
    }
}
