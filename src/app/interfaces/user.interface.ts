import { Product } from "./product.interface";

export interface User {
  _id?: string,
  key?: string,
  name?: string,
  email?: string,
  cellphone?: string,
  cpf?: string,
  password?: string,
  postalCode?: string,
  state?: string,
  city?: string,
  street?: string,
  neighborhood?: string,
  houseNumber?: number,
  user_id?: number,
  administrator?: boolean,
  productsCart?: Product[],
  token?: string,
};
