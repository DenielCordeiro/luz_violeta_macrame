import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/interfaces/product.interface';
import { MATERIAL_IMPORTS } from 'src/app/shared/material.imports';

@Component({
	selector: 'app-delete-product',
	standalone: true,
	imports: [
		MATERIAL_IMPORTS
	],
	templateUrl: './delete-product.component.html',
	styleUrls: ['./delete-product.component.sass'],
})
export class DeleteProductComponent {
	private productsService: ProductsService = inject(ProductsService);

	constructor(
		@Inject(MAT_DIALOG_DATA) public product: Product,
		public dialogRef: MatDialogRef<DeleteProductComponent>,
	) {
		console.log('product', product);
	}

	public deletingProduct(productId: string | undefined): void {
		if (productId !== undefined) {
			this.productsService.deleteProduct(productId)
				.then(result => {
					console.log(result);
					this.closeDialog();
				})
		} else {
			alert('[Erro!], não foi possível encontrar id do produto selecionado');
		}
	}

	public closeDialog(): void {
		this.dialogRef.close();
	}
}
