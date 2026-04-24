import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products/products.service';
import { Product } from 'src/app/interfaces/product.interface';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.sass'],
})
export class DeleteProductComponent implements OnInit {
  private productsService: ProductsService = inject(ProductsService);
  public product!: Product;

  constructor(
    @Inject(MAT_DIALOG_DATA) public loadedProduct: Product[],
    public dialog: MatDialog
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
}
