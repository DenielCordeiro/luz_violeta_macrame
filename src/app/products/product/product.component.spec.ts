import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ProductComponent } from './product.component';
import { ProductsService } from '../../services/products/products.service';
import { StorageService } from '../../services/storage/storage.service';
import { MelhorEnvioService } from '../../services/melhor-envio/melhor-envio.service';
import { CartService } from '../../services/cart/cart.service';
import { Product } from '../../interfaces/product.interface';

describe('Product URL navigation', () => {
    let fixture: ComponentFixture<ProductComponent>;
    let service: jasmine.SpyObj<ProductsService>;
    let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

    beforeEach(() => {
        params = new BehaviorSubject(convertToParamMap({ product_id: 'current' }));
        service = jasmine.createSpyObj<ProductsService>('ProductsService', ['getProduct', 'getProductLocalStorage']);
        service.getProduct.and.callFake(async id => ({ _id: id, name: id }));
        service.getProductLocalStorage.and.resolveTo({ _id: 'old', name: 'Peça anterior' });
        TestBed.configureTestingModule({
            imports: [ProductComponent],
            providers: [
                provideRouter([]),
                { provide: ActivatedRoute, useValue: { paramMap: params, snapshot: { paramMap: params.value } } },
                { provide: ProductsService, useValue: service },
                { provide: StorageService, useValue: { get: () => ({}) } },
                { provide: MelhorEnvioService, useValue: {} },
                { provide: CartService, useValue: { getProductsInCart: async () => [] } },
                { provide: MatDialog, useValue: {} },
            ],
        }).overrideComponent(ProductComponent, { set: { template: '', imports: [] } });
        fixture = TestBed.createComponent(ProductComponent);
    });

    it('loads the URL ID regardless of the previously saved product', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        expect(service.getProduct).toHaveBeenCalledWith('current');
        expect(service.getProductLocalStorage).not.toHaveBeenCalled();
        expect(fixture.componentInstance.product._id).toBe('current');
    });

    it('reloads when only the route ID changes', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        params.next(convertToParamMap({ product_id: 'next' }));
        await fixture.whenStable();
        expect(fixture.componentInstance.products.map(product => product._id)).toEqual(['next']);
    });

    it('ignores late responses from an earlier URL', async () => {
        let resolveOld!: (product: Product) => void;
        service.getProduct.and.callFake(id => id === 'current'
            ? new Promise(resolve => { resolveOld = resolve; })
            : Promise.resolve({ _id: id, name: id }));
        fixture.detectChanges();
        params.next(convertToParamMap({ product_id: 'next' }));
        await fixture.whenStable();
        resolveOld({ _id: 'current', name: 'Anterior' });
        await fixture.whenStable();
        expect(fixture.componentInstance.product._id).toBe('next');
    });

    it('clears the previous product and exposes load failure', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        service.getProduct.and.rejectWith(new Error('Unavailable'));
        params.next(convertToParamMap({ product_id: 'missing' }));
        await fixture.whenStable();
        expect(fixture.componentInstance.products).toEqual([]);
        expect(fixture.componentInstance.hasLoadError).toBeTrue();
    });
});
