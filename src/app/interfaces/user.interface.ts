import { Product } from "./product.interface";

export interface User {
  _id?: string,
  user_id?: string,
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
  productsCart?: Product[],
  token?: string,
};
