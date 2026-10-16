import { Component, DestroyRef, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MenuService } from 'src/app/services/menu/menu.service';
import { DesktopMenuComponent } from './desktop-menu/desktop-menu.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [DesktopMenuComponent, MatButtonModule],
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.sass'],
})
export class MenuComponent {
    @ViewChild('menuToggle', { read: ElementRef }) private menuToggle?: ElementRef<HTMLButtonElement>;
    private readonly destroyRef = inject(DestroyRef);

    constructor(public menuService: MenuService, breakpointObserver: BreakpointObserver) {
        breakpointObserver.observe('(max-width: 900px)')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ matches }) => {
                if (!matches) {
                    this.menuService.closeMenu('noAction');
                }
            });
    }

    public changeIconBurguer(): void {
        this.menuService.toggleMenu();
    }

    @HostListener('document:keydown.escape')
    public closeWithKeyboard(): void {
        if (this.menuService.menuOpen()) {
            this.menuService.closeMenu('noAction');
            this.menuToggle?.nativeElement.focus();
        }
    }
}
