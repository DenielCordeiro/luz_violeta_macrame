import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/interfaces/product.interface';
import { MATERIAL_IMPORTS } from 'src/app/shared/material.imports';
import { Router } from '@angular/router';

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
	private message: string = '';

	constructor(
		@Inject(MAT_DIALOG_DATA) public product: Product,
		public dialogRef: MatDialogRef<DeleteProductComponent>,
		public route: Router,
	) {}

	public deletingProduct(productId: string | undefined): void {
		if (productId !== undefined) {
			this.productsService.deleteProduct(productId)
				.then((result) => {
					this.message = result;
					this.closeDialog();
					this.productsService.removeProductSelected();
					this.route.navigate(['/products']);
				});
		} else {
			alert('[Erro!], não foi possível encontrar id do produto selecionado');
		}
	}

	public closeDialog(): void {
		this.dialogRef.close();
	}
}
