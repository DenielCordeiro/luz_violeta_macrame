import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { Shipping } from 'src/app/interfaces/shipping.interface';

@Injectable({
  providedIn: 'root'
})
export class MelhorEnvioService {
  private readonly melhorEnvioAPI = environment.api + '/melhor-envio';
  shippings: Shipping[] = [];

  constructor(public http: HttpClient) {}

 
  public getShipping(postalCode: string): Promise<Shipping[]>{
    return lastValueFrom(this.http.post(`${this.melhorEnvioAPI + '/:' + postalCode}`, null))
      .then(result => {
        return this.handleResponse(result);
      });
  }

  handleResponse(result: any): Shipping[] {
    const data = result;
    const prices: number[] = [];
    let smallPrice!: number;

    console.log("fretes: ", data);
    

    data.forEach((data: any) => {

      if (data.price != null && (data.company.name == "Jadlog" || data.company.name == "Correios")) {
        prices.push(data.price)
        smallPrice = Math.min(...prices.map(Number));

        if (data.price == smallPrice) {
          this.shippings.pop();
          this.shippings.push(data);
        } 
      } 
    });

    return this.shippings;
  }

}
