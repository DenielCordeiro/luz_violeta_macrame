export interface Product {
  _id?: string; 
  name?: string;
  description?: string;
  included_items?: string;
  warranty?: string;
  price?: number;
  stock?: number;
  type?: string[];
  category?: string[];
  characteristics?: string[];
  deadline?: Date;
  packaging?: {
    weight?: number;
    height?: number;
    width?: number;
    length?: number;
  };
  file?: {
    name?: string;
    size?: number;
    url?: string;
    createdAt?: string | Date;
  };
  selection?: boolean;
}