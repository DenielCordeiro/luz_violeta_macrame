import { Component, inject, Inject, OnInit } from '@angular/core';
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
export class DeleteProductComponent implements OnInit {
  private productsService: ProductsService = inject(ProductsService);
  public product!: Product;

  constructor(
    @Inject(MAT_DIALOG_DATA) public loadedProduct: Product[],
    public dialogRef: MatDialogRef<DeleteProductComponent>,
  ) {}

  public ngOnInit(): void {
    this.product = this.loadProductData();
  }

  public loadProductData(): Product {
    const extratedProduct = this.loadedProduct[0];

    return extratedProduct;
  }

  public deletingProduct(productId: string | undefined): void {
    if (productId !== undefined) {
      this.productsService.deleteProduct(productId)
        .then(result => {
          console.log(result);
        })
    } else {
      alert('[Erro!], não foi possível encontrar id do produto selecionado');
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
