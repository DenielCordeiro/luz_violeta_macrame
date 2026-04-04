import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { LoginComponent } from '../../login/login.component';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
    selector: 'app-desktop-menu',
    standalone: true,
    imports: [LoginComponent],
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
        private menuService: MenuService
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
        this.closingMenu(noAction);
    }

    closingMenu(url: string): void {
        this.menuService.closeMenu(url);
    }
}
