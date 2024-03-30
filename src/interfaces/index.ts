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
  id: number;
  attributes: {
    title: string;
    categories: {
      data: ICategories[];
    };
    thumbnail: {
      data: IImage;
    };
    products: {
      data: IProducts[];
    };
  };
}

export interface IProduct {
  id: number;
  category: ICategory;
  attributes: {
    brand: string;
    description: string;
    discountPercentage: number;
    price: number;
    rating: number;
    stock: number;
    title: string;
    categories: {
      data: ICategories[];
    };
    images: {
      data: IImage[];
    };
    thumbnail: {
      data: IImage;
    };
  };
}
