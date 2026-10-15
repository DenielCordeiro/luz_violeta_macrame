import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../guards/auth.service';
import { MenuService } from '../../services/menu/menu.service';
import { StartComponent } from './start/start.component';

describe('Account entry points', () => {
    let closed: Subject<void>;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        localStorage.removeItem('session');
        closed = new Subject<void>();
        dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open', 'closeAll']);
        const dialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>('MatDialogRef', ['afterClosed']);
        dialogRef.afterClosed.and.returnValue(closed);
        dialog.open.and.returnValue(dialogRef);
        TestBed.configureTestingModule({
            imports: [LoginComponent, StartComponent],
            providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), { provide: MatDialog, useValue: dialog }],
        });
    });

    afterEach(() => {
        TestBed.inject(HttpTestingController).verify();
        localStorage.removeItem('session');
    });

    it('offers login and registration to visitors', () => {
        const fixture = TestBed.createComponent(LoginComponent);
        fixture.componentInstance.showRegister = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('button').textContent).toContain('Entrar');
        expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/register');
        TestBed.inject(MenuService).toggleMenu();
        fixture.nativeElement.querySelector('button').click();
        expect(dialog.open).toHaveBeenCalled();
        expect(TestBed.inject(MenuService).menuOpen()).toBeFalse();
    });

    it('updates both header and menu entries after the login dialog closes', () => {
        const header = TestBed.createComponent(LoginComponent);
        const menu = TestBed.createComponent(LoginComponent);
        header.detectChanges();
        menu.detectChanges();
        header.componentInstance.loginDialog();
        localStorage.setItem('session', JSON.stringify({ name: 'Cliente de teste' }));
        closed.next();
        closed.complete();
        header.detectChanges();
        menu.detectChanges();
        for (const fixture of [header, menu]) {
            expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe('/profile');
            expect(fixture.nativeElement.textContent).toContain('Minha conta');
            expect(fixture.nativeElement.querySelector('button')).toBeNull();
        }
    });

    it('returns to visitor controls after a successful logout', async () => {
        const service = TestBed.inject(AuthService);
        localStorage.setItem('session', JSON.stringify({ name: 'Cliente de teste' }));
        service.refreshProfile();
        const fixture = TestBed.createComponent(LoginComponent);
        fixture.detectChanges();
        const logout = service.logout();
        TestBed.inject(HttpTestingController).expectOne(request => request.url.endsWith('/session/logout')).flush({});
        await logout;
        fixture.detectChanges();
        expect(service.profile()).toBeNull();
        expect(fixture.nativeElement.querySelector('button').textContent).toContain('Entrar');
    });

    it('keeps failed login open and lets the visitor retry', async () => {
        const fixture = TestBed.createComponent(StartComponent);
        fixture.detectChanges();
        fixture.componentInstance.loginForm.setValue({ email: 'client@example.test', password: 'synthetic-test' });
        const attempt = fixture.componentInstance.makeLogin();
        TestBed.inject(HttpTestingController).expectOne(request => request.url.endsWith('/session/'))
            .flush({}, { status: 401, statusText: 'Unauthorized' });
        await attempt;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
        expect(fixture.componentInstance.isSubmitting).toBeFalse();
        expect(dialog.closeAll).not.toHaveBeenCalled();
        const retry = fixture.componentInstance.makeLogin();
        TestBed.inject(HttpTestingController).expectOne(request => request.url.endsWith('/session/'))
            .flush({ name: 'Cliente de teste', token: 'synthetic-test-token' });
        await retry;
        expect(dialog.closeAll).toHaveBeenCalled();
        expect(TestBed.inject(AuthService).profile()?.name).toBe('Cliente de teste');
    });
});
