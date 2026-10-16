import { Component, DestroyRef, inject, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../guards/auth.service';
import { MenuService } from '../../services/menu/menu.service';
import { StartComponent } from './start/start.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, MatIconModule, MatButtonModule, NgTemplateOutlet],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
    @Input() public showRegister = false;
    @Input() public iconOnly = false;
    public readonly authService = inject(AuthService);
    public readonly menuService = inject(MenuService);
    private readonly dialog = inject(MatDialog);
    private readonly destroyRef = inject(DestroyRef);

    public loginDialog(): void {
        this.menuService.closeMenu('noAction');
        this.dialog.open(StartComponent, { ariaLabel: 'Entrar na sua conta' })
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.authService.refreshProfile());
    }
}
