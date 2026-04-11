import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { StorageService } from '../services/storage/storage.service';
import { ProductsService } from './../services/products/products.service';
import { MelhorEnvioService } from '../services/melhor-envio/melhor-envio.service';
import { CartService } from '../services/cart/cart.service';

import { Product } from '../interfaces/product.interface';
import { Shipping } from '../interfaces/shipping.interface';
import { Sale } from '../interfaces/sale.interface';
import { User } from '../interfaces/user.interface';
import { DeleteProductComponent } from '../products/delete-product/delete-product.component';
import { AddOrEditProductComponent } from '../products/add-or-edit-product/add-or-edit-product.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.sass',
})
export class ProductComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  productsInCart: Product[] = [];
  shippings: Shipping[] = [];
  products: Product[] = [];
  product: Product = {};
  sale: Sale = {};
  userProfile: User = {};
  postalCode: string = '';
  productsQuantity: number = 1;
  productIsInCart: boolean = false;
  productAddedToCart: boolean = true;

  constructor(
    public route: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public storage: StorageService,
    public productsService: ProductsService,
    public melhorEnvio: MelhorEnvioService,
    public cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.getProductSelected();
    this.getCurrentShipping();
    this.buildingForm();
    // this.getUserProfile();
    this.checkIfProductIsInCart();
  }

  getProductSelected(): void {
    try {
      this.product = this.productsService.getProductSelected();
    } catch (error) {
      console.error({
        "message:": "Não foi possível buscar o produto do serviço.",
        "fail: ": error,
      })
    }

    if (!this.product) {
      console.error('Nenhum produto selecionado!');
      return;
    } else {
      this.products.push(this.product);
    }
  }

  getUserProfile(): void {
    try {
      this.userProfile = this.storage.get('profile', {});
    } catch (error) {
      console.error('Nenhum perfil encontrado:', error);
    }
  }


  buildingForm(): void {
    this.searchForm = this.formBuilder.group({
      "postalCode": [null],
    });
  }

  getCurrentShipping(): void {
      try {
        const shipping = localStorage.getItem('shipping');

        if (shipping) {
          this.sale.shipping = JSON.parse(shipping);
        } else {
          console.error('Nenhum frete encontrado no localStorage.');
        }
      } catch (error) {
        console.error('Nenhum frete encontrado:', error);
      }
  }

  searchShipping(): void {
    const postalCodeNumber = this.searchForm?.value;
    this.postalCode = String(postalCodeNumber?.postalCode)

    if (this.postalCode == 'null') {

      alert("[Atenção]: Precisa digitar algum número de CEP!");

    } else {
      this.melhorEnvio.getShipping(this.postalCode)
        .then(result => {
          this.sale.shipping = {
            company: {
              name: result[0]?.company?.name,
              picture: result[0]?.company?.picture
            },
            price: Number(result[0]?.price),
            postalCode: postalCodeNumber?.postalCode
          };

          localStorage.setItem('shipping', JSON.stringify(this.sale.shipping));
        })
        .catch(error => {
          console.log(error);
        })
    };
  };

  changeQuantity(action: string): number {
    if (action === 'add') {
      this.productsQuantity++;
    } else if (action === 'remove' && this.productsQuantity > 1) {
      this.productsQuantity--;
    }
    return this.productsQuantity;
  }

  addingToCart(): void {
    this.cartService.addToCart(this.product)
      .then(() => {
        this.checkIfProductIsInCart();
      })
      .catch(error => {
        console.error('Erro ao adicionar produto ao carrinho:', error);
      });
  }

  removingProductFromCart(): void {
    this.cartService.removeProductFromCart(this.product)
      .then(() => {
        this.checkIfProductIsInCart();
      })
      .catch(error => {
        console.error('Erro ao remover produto do carrinho:', error);
      });
  }

  checkIfProductIsInCart(): void {
    const loadProductsInCart = this.cartService.productsInCart;

    loadProductsInCart.subscribe(products => {
      this.productsInCart = products;
    });

    if (this.productsInCart.length > 0) {
      this.productsInCart.forEach(product => {        
        if (product._id === this.product._id) {
          this.productIsInCart = true;
        } else {
          this.productIsInCart = false;
        }
      });
    } else {
      this.productIsInCart = false;
    }
  }

  goToCart(): void {
    this.route.navigate(['/cart/', this.userProfile._id]);
  }

  updateModal(product: Product | undefined): void {
    if (product) {
      this.dialog.open<AddOrEditProductComponent>(AddOrEditProductComponent, {
        data:  product,
      });
    } else {
      console.error('ID do produto não encontrado para atualização.');
    }
  }
  
  deleteModal(id: string | undefined): void {
     if (id) {
      this.dialog.open<DeleteProductComponent>(DeleteProductComponent, {
        data: { productId: id },
      });
    } else {
      console.error('ID do produto não encontrado para excluir.');
    }
  }

  ngOnDestroy(): void {
    this.productsService.removeProductSelected();
  }
}
