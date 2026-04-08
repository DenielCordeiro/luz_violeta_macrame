import { BaseCrud } from "./base-crud.interface";

export interface BaseAPI<T extends BaseCrud> {
  success?: boolean,
};
