import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MenuService } from './menu.service';

describe('MenuService navigation', () => {
    it('closes the menu even when selecting the current URL', () => {
        TestBed.configureTestingModule({ providers: [provideRouter([])] });
        const service = TestBed.inject(MenuService);
        service.toggleMenu();
        service.closeMenu(TestBed.inject(Router).url);
        expect(service.menuOpen()).toBeFalse();
    });
});
