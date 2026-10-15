import { Product } from "./product.interface";

export interface IBanner {
    _id?: string;
    altText?: string;
    link?: string;
    file?: {
        name: string;
        size: string | number;
        key: string;
        url: string;
        createdAt?: Date | string;
    };
}

export interface Home {
    _id?: string;
    banners?: Array<IBanner>;
    featuredProducts?: Array<Product>;
}