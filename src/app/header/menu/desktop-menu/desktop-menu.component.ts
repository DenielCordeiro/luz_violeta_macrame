import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuService } from '../../../services/menu/menu.service';
import { AuthService } from '../../../guards/auth.service';
import { LoginComponent } from '../../login/login.component';

@Component({
    selector: 'app-desktop-menu',
    standalone: true,
    imports: [RouterLink, LoginComponent, MatIconModule, MatButtonModule],
    templateUrl: './desktop-menu.component.html',
    styleUrls: ['./desktop-menu.component.sass'],
})
export class DesktopMenuComponent {
    public readonly authService = inject(AuthService);
    public readonly menuService = inject(MenuService);
    public administrator = false;
    public modalLogout = false;
    public logoutError = false;
    public isLoggingOut = false;

    public async isLogout(): Promise<void> {
        if (this.isLoggingOut) return;
        this.isLoggingOut = true;
        this.logoutError = false;
        try {
            await this.authService.logout();
            this.modalLogout = false;
            this.menuService.closeMenu('noAction');
        } catch {
            this.logoutError = true;
        } finally {
            this.isLoggingOut = false;
        }
    }
}
