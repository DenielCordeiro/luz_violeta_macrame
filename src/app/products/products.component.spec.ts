import { Product } from '../interfaces/product.interface';
import { EMPTY_PRODUCT_FILTERS, ProductFilters } from './product-filters/product-filters.component';
import {
	filterProducts,
	mergeProductPages,
} from './products.component';

describe('Products filtering', () => {
	const products: Product[] = [
		{
			_id: '1',
			name: 'Luminária Aurora',
			type: { name: 'Iluminação' },
			category: { name: 'Casa' },
			selection: true,
			price: 180,
		},
		{
			_id: '2',
			name: 'Painel Brisa',
			type: { name: 'Decoração' },
			category: { name: 'Parede' },
			selection: false,
			price: 320,
		},
		{
			_id: '3',
			name: 'Kit Lua',
			type: { name: 'Decoração' },
			category: { name: 'Casa' },
			selection: true,
			price: 240,
		},
	];

	function filters(overrides: Partial<ProductFilters> = {}): ProductFilters {
		return { ...EMPTY_PRODUCT_FILTERS, ...overrides };
	}

	it('shows every loaded product when filters are empty', () => {
		expect(filterProducts(products, filters())).toEqual(products);
	});

	it('filters one text field without changing the original collection', () => {
		const originalProducts = structuredClone(products);

		const result = filterProducts(products, filters({ name: 'luminaria' }));

		expect(result.map((product) => product._id)).toEqual(['1']);
		expect(products).toEqual(originalProducts);
	});

	it('combines type, category, selection and price filters', () => {
		const result = filterProducts(products, filters({
			type: 'decoracao',
			category: 'casa',
			selection: 'selected',
			minPrice: 200,
			maxPrice: 250,
		}));

		expect(result.map((product) => product._id)).toEqual(['3']);
	});

	it('does not restrict results for whitespace and empty price fields', () => {
		const result = filterProducts(products, filters({
			name: '   ',
			type: '',
			category: ' ',
			minPrice: null,
			maxPrice: null,
		}));

		expect(result).toEqual(products);
	});

	it('restores all products when active filters are reset', () => {
		const filtered = filterProducts(products, filters({ maxPrice: 200 }));
		const reset = filterProducts(products, filters());

		expect(filtered.map((product) => product._id)).toEqual(['1']);
		expect(reset).toEqual(products);
	});

	it('returns an empty collection when no loaded product matches', () => {
		expect(filterProducts(products, filters({ category: 'Jardim' }))).toEqual([]);
	});
});

describe('Products pagination merge', () => {
	it('keeps page order and ignores repeated product ids', () => {
		const currentPage: Product[] = [{ _id: '1', name: 'Primeiro' }];
		const nextPage: Product[] = [
			{ _id: '1', name: 'Primeiro repetido' },
			{ _id: '2', name: 'Segundo' },
		];

		expect(mergeProductPages(currentPage, nextPage)).toEqual([
			{ _id: '1', name: 'Primeiro' },
			{ _id: '2', name: 'Segundo' },
		]);
		expect(currentPage).toEqual([{ _id: '1', name: 'Primeiro' }]);
	});

	it('keeps products without an id because they cannot be safely deduplicated', () => {
		const productWithoutId: Product = { name: 'Rascunho' };

		expect(mergeProductPages([], [productWithoutId, productWithoutId])).toEqual([
			productWithoutId,
			productWithoutId,
		]);
	});
});
