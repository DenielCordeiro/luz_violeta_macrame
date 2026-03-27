import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudCartService } from './crud-cart/crud-cart.service';
import { Product } from 'src/app/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService extends CrudCartService<Product> {

  constructor(
    public httpClient: HttpClient,
  ) {
    super(httpClient);
   }
}
