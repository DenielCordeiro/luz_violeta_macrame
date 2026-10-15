import { Product } from "./product.interface";

export interface IBanner {
    _id?: string;
    altText?: string;
    link?: string;
    file?: {
        name: string;
        size: string | number; // Às vezes o tamanho vem como número do banco
        key: string;
        url: string;
        createdAt?: Date | string;
    };
}

export interface HomeData {
    banners?: Array<IBanner>;
    featuredProducts?: Array<Product>;
}