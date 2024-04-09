export interface IImage {
  attributes: {
    url: string;
    alternativeText: string;
  };
}

export interface ICategories {
  id: number;
  attributes: {
    title: string;
    description: string;
  };
}

export interface IProducts {
  id: string;
  attributes: {
    brand: string;
    description: string;
    discountPercentage: number;
    price: number;
    rating: number;
    stock: number;
    title: string;
  };
}

export interface ICategory {
  typeData?: "product" | "category";
  id: number;
  attributes: {
    description: string;
    title: string;
    categories: {
      data: ICategories[];
    };
    thumbnail: {
      data: IImage;
    };
    products?: {
      data: IProducts[];
    };
  };
}

export interface IProduct {
  typeData?: "product" | "category";
  id: number;
  category?: ICategory;
  attributes: {
    brand?: string;
    description: string;
    discountPercentage?: number;
    price?: number;
    rating?: number;
    stock?: number;
    title: string;
    categories: {
      data: ICategories[];
    };
    images?: {
      data: IImage[];
    };
    thumbnail: {
      data: IImage;
    };
  };
}

export interface IUser {
  identifier: string;
  password: string;
}

export interface ICart {
  id: number;
  attributes: { email: string; products: { data: IProduct[] } };
}
