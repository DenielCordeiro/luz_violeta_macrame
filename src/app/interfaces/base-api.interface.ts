import { BaseCrud } from "./base-crud.interface";
import { User } from "./user.interface";

export interface BaseAPI<T extends BaseCrud> {
  success?: boolean,
  token?: string,
  user?: User
};
