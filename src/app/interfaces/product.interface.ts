export interface Product {
  _id?: string,
  name?: string,
  description?: string,
  valor?: number,
  category?: string,
  collection?: string,
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
