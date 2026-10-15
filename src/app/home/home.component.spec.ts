import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appRoutes } from '../../app.routes';
import { HomeComponent } from './home.component';
import { ProductsService } from '../services/products/products.service';

@Component({
    standalone: true,
    template: '<h1>Catálogo</h1>',
})
class CatalogStubComponent {}

describe('Home navigation', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter(appRoutes.map(route => route.path === 'products'
                ? { path: 'products', component: CatalogStubComponent }
                : route)), {
                    provide: ProductsService,
                    useValue: { getProducts: () => Promise.resolve({ products: { docs: [] } }) },
                }],
        });
    });

    for (const path of ['/', '/newsletter', '/home']) {
        it(`renders the home from ${path}`, async () => {
            const harness = await RouterTestingHarness.create();
            await harness.navigateByUrl(path, HomeComponent);
            expect(TestBed.inject(Router).url).toBe('/home');
            expect(harness.routeNativeElement?.querySelector('h1')?.textContent)
                .toContain('habitar com calma');
        });
    }

    it('opens the catalog from the main call to action', async () => {
        const harness = await RouterTestingHarness.create('/home');
        const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>('.primary-link');
        expect(link).not.toBeNull();
        link?.click();
        await harness.fixture.whenStable();
        expect(TestBed.inject(Router).url).toBe('/products');
    });

    it('keeps the editorial content independent from API availability', async () => {
        const harness = await RouterTestingHarness.create('/home');
        expect(harness.routeNativeElement?.querySelector('#atelier')).not.toBeNull();
        expect(harness.routeNativeElement?.querySelector('#process')).not.toBeNull();
        expect(harness.routeNativeElement?.querySelectorAll('h1').length).toBe(1);
        expect(harness.routeNativeElement?.textContent).toContain('Imagens ilustrativas');
    });
});
