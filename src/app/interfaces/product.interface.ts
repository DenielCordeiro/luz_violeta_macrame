export interface Product {
  _id?: string,
  name?: string,
  description?: string,
  valor?: number,
  type?: string,
  category?: string,
  selection?: boolean,
  file?: {
    name?: string,
    size?: number,
    url?: string,
    createdAt?: {
      type?: Date,
      default?: Date
    }
  }
}
