export interface IImage {
  data: {
    attributes: {
      url: string;
      alternativeText: string;
    };
  };
}

export interface ICategories {
  data: {
    attributes: {
      title: string;
    };
  };
}

export interface IProduct {
  id: string;
  attributes: {
    brand: string;
    description: string;
    discountPercentage: number;
    price: number;
    rating: number;
    stock: number;
    title: string;
    categories: ICategories[];
    images: IImage[];
    thumbnail: IImage;
  };
}
