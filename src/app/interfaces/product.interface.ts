export interface Product {
  _id?: string; 
  name?: string;
  description?: string;
  included_items?: string;
  warranty?: string;
  price?: number;
  stock?: number;
  type?: {
    name?: string;
  };
  category?: {
    name?: string;
  };
  characteristics?: string;
  deadline?: string;
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

export interface Warranty {
  value: number;
  viewValue: string;
}

export interface Deadline {
  value: number;
  viewValue: string;
}

export interface PaginatedProductsResponse {
  products: {
    docs: Product[];
    total?: number;
    limit?: number;
    page?: number;
    pages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}