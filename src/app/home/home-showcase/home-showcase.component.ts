import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { defer, timeout } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products/products.service';

interface ShowcaseProduct extends Product {
    _id: string;
    name: string;
}

@Component({
    selector: 'app-home-showcase',
    standalone: true,
    imports: [CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule],
    templateUrl: './home-showcase.component.html',
    styleUrl: './home-showcase.component.sass',
})
export class HomeShowcaseComponent implements OnInit {
    private readonly productsService = inject(ProductsService);
    private readonly destroyRef = inject(DestroyRef);
    public products: ShowcaseProduct[] = [];
    public isLoading = false;
    public hasError = false;
    public failedImages = new Set<string>();

    ngOnInit(): void {
        this.loadProducts();
    }

    public loadProducts(): void {
        if (this.isLoading) return;
        this.isLoading = true;
        this.hasError = false;
        this.failedImages.clear();
        defer(() => this.productsService.getProducts(1, 3))
            .pipe(timeout(10000), takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: response => {
                    if (!Array.isArray(response?.products?.docs)) {
                        this.hasError = true;
                    } else {
                        this.products = response.products.docs.filter((product): product is ShowcaseProduct =>
                            product && typeof product._id === 'string' && product._id.trim().length > 0 &&
                            typeof product.name === 'string' && product.name.trim().length > 0
                        ).slice(0, 3);
                    }
                    this.isLoading = false;
                },
                error: () => {
                    this.hasError = true;
                    this.isLoading = false;
                },
            });
    }

    public markImageFailed(product: Product): void {
        if (product._id) this.failedImages.add(product._id);
    }

    public hasPrice(product: Product): boolean {
        return typeof product.price === 'number' && Number.isFinite(product.price) && product.price >= 0;
    }
}
