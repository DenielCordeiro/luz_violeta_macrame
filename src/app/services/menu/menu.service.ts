import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private _menuOpen = signal(false);
    public menuOpen = this._menuOpen.asReadonly();
    public lastUrl = signal('');

    constructor(private router: Router) { }

    public toggleMenu(): void {
        this._menuOpen.update(valor => !valor);
    }

    public closeMenu(nextUrl: string): void {
        const activeRoute = this.router.url;

        if (nextUrl === 'noAction') {
            this._menuOpen.set(false);
        } else if (nextUrl === activeRoute) {
            console.log('Você já está nesta página!');
        } else {
            this._menuOpen.set(false);
            this.router.navigate([nextUrl]);
        }
    }

    public saveCurrentUrl(url: string): string {
        this.lastUrl.set(url);
        localStorage.setItem('lastUrl', url);

        return this.lastUrl();
    }

    public returnLastUrl(): string {
        const lastUrl = localStorage.getItem('lastUrl');

        if (lastUrl) {
            this.lastUrl.set(lastUrl);
        }

        this.router.navigate([this.lastUrl()]);

        return this.lastUrl();
    }
}