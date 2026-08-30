import { Component, computed, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export type ProductSelectionFilter = 'all' | 'selected' | 'not-selected';

export interface ProductFilters {
	name: string;
	type: string;
	category: string;
	selection: ProductSelectionFilter;
	minPrice: number | null;
	maxPrice: number | null;
}

export const EMPTY_PRODUCT_FILTERS: ProductFilters = {
	name: '',
	type: '',
	category: '',
	selection: 'all',
	minPrice: null,
	maxPrice: null,
};

@Component({
	selector: 'app-product-filters',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
	],
	templateUrl: './product-filters.component.html',
	styleUrl: './product-filters.component.sass',
})
export class ProductFiltersComponent {
	public readonly filtersChange = output<ProductFilters>();

	public readonly filterForm = new FormGroup({
		name: new FormControl('', { nonNullable: true }),
		type: new FormControl('', { nonNullable: true }),
		category: new FormControl('', { nonNullable: true }),
		selection: new FormControl<ProductSelectionFilter>('all', { nonNullable: true }),
		minPrice: new FormControl<number | null>(null),
		maxPrice: new FormControl<number | null>(null),
	});

	private readonly filterValues = signal<ProductFilters>(EMPTY_PRODUCT_FILTERS);
	public readonly filtersAreActive = computed(() => {
		const filters = this.filterValues();

		return filters.name.trim() !== ''
			|| filters.type.trim() !== ''
			|| filters.category.trim() !== ''
			|| filters.selection !== 'all'
			|| filters.minPrice !== null
			|| filters.maxPrice !== null;
	});

	constructor() {
		this.filterForm.valueChanges
			.pipe(takeUntilDestroyed())
			.subscribe(() => {
				const filters = this.filterForm.getRawValue();
				this.filterValues.set(filters);
				this.filtersChange.emit(filters);
			});
	}

	public clearFilters(): void {
		this.filterForm.reset(EMPTY_PRODUCT_FILTERS);
	}
}
