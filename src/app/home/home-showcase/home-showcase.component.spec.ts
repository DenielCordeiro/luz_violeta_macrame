import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../interfaces/product.interface';
import { HomeShowcaseComponent } from './home-showcase.component';

registerLocaleData(localePt);

describe('HomeShowcaseComponent', () => {
    let fixture: ComponentFixture<HomeShowcaseComponent>;
    let service: jasmine.SpyObj<ProductsService>;
    const products: Product[] = [
        { _id: 'one', name: 'Painel', price: 120, file: { url: '/panel.webp' } },
        { _id: 'two', name: 'Suporte', price: 75 },
        { _id: 'three', name: 'Trama', price: 0 },
    ];

    beforeEach(() => {
        service = jasmine.createSpyObj<ProductsService>('ProductsService', ['getProducts']);
        TestBed.configureTestingModule({
            imports: [HomeShowcaseComponent],
            providers: [provideRouter([]), { provide: ProductsService, useValue: service }],
        });
        fixture = TestBed.createComponent(HomeShowcaseComponent);
    });

    for (const count of [0, 1, 2, 3]) {
        it(`renders ${count} products in catalog order`, fakeAsync(() => {
            service.getProducts.and.resolveTo({ products: { docs: products.slice(0, count) } });
            fixture.detectChanges();
            flushMicrotasks();
            fixture.detectChanges();
            const cards = fixture.nativeElement.querySelectorAll('.product-card') as NodeListOf<HTMLAnchorElement>;
            expect(cards.length).toBe(count);
            expect(service.getProducts).toHaveBeenCalledOnceWith(1, 3);
            if (count) {
                expect(cards[0].getAttribute('href')).toBe('/product/one');
                expect(cards[0].textContent).toContain('120,00');
                expect(fixture.nativeElement.querySelector('.three-items') !== null).toBe(count === 3);
                expect(fixture.nativeElement.querySelector('.single-item') !== null).toBe(count === 1);
            } else {
                expect(fixture.nativeElement.textContent).toContain('Ainda não há peças');
            }
        }));
    }

    it('keeps loading local, times out and allows retry', fakeAsync(() => {
        service.getProducts.and.returnValue(new Promise(() => {}));
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Carregando');
        tick(10000);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Não foi possível');
        service.getProducts.and.resolveTo({ products: { docs: products } });
        fixture.nativeElement.querySelector('button').click();
        flushMicrotasks();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.product-card').length).toBe(3);
    }));

    it('does not invent names, prices or images', fakeAsync(() => {
        service.getProducts.and.resolveTo({ products: { docs: [{}, { _id: 'missing-name' }, { _id: 'valid', name: 'Peça real' }] } });
        fixture.detectChanges();
        flushMicrotasks();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.product-card').length).toBe(1);
        expect(fixture.nativeElement.textContent).toContain('Preço indisponível');
        expect(fixture.nativeElement.textContent).toContain('Imagem indisponível');
        expect(fixture.nativeElement.querySelector('img')).toBeNull();
    }));

    it('replaces broken product photos with a neutral message', fakeAsync(() => {
        service.getProducts.and.resolveTo({ products: { docs: products.slice(0, 1) } });
        fixture.detectChanges();
        flushMicrotasks();
        fixture.detectChanges();
        fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('img')).toBeNull();
        expect(fixture.nativeElement.textContent).toContain('Imagem indisponível');
    }));

    it('shows an error instead of an empty catalog when the API fails', fakeAsync(() => {
        service.getProducts.and.rejectWith(new Error('Offline'));
        fixture.detectChanges();
        flushMicrotasks();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Tentar novamente');
        expect(fixture.nativeElement.textContent).not.toContain('Ainda não há peças');
    }));
});
