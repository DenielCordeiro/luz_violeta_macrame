import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private _menuAberto = signal(false);
    public menuAberto = this._menuAberto.asReadonly();
    public lastUrl = signal('');

    constructor(private router: Router) { }

    toggleMenu(): void {
        this._menuAberto.update(valor => !valor);
    }

    closeMenu(nextUrl: string): void {
        const activeRoute = this.router.url;

        if (nextUrl === 'noAction') {
            this._menuAberto.set(false);
        } else if (nextUrl === activeRoute) {
            console.log('Você já está nesta página!');
        } else {
            this._menuAberto.set(false);
            this.router.navigate([nextUrl]);
        }
    }

    public saveCurrentUrl(url: string): string {
        this.lastUrl.set(url);
        localStorage.setItem('lastUrl', url);

        return this.lastUrl();
    }

    returnLastUrl(): string {
        const lastUrl = localStorage.getItem('lastUrl');

        if (lastUrl) {
            this.lastUrl.set(lastUrl);
        }

        this.router.navigate([this.lastUrl()]);

        return this.lastUrl();
    }
}