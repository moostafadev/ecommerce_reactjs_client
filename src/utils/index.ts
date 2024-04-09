import { createStandaloneToast } from "@chakra-ui/react";
import { IProduct } from "../interfaces";
const { toast } = createStandaloneToast();

export const addToShoppingCartItems = (
  cartItem: IProduct,
  shoppingCartItems: IProduct[]
) => {
  toast({
    title: "Added to your cart.",
    status: "success",
    duration: 2000,
    isClosable: true,
  });
  return [
    ...shoppingCartItems,
    {
      ...cartItem,
      attributes: {
        ...cartItem.attributes,
        qty: 1,
      },
    },
  ];
};

export const removeFromShoppingCartItems = (
  cartItem: IProduct,
  shoppingCartItems: IProduct[]
) => {
  const filteredCartItems = shoppingCartItems.filter(
    (item) => item.id !== cartItem.id
  );

  if (filteredCartItems.length < shoppingCartItems.length) {
    toast({
      title: "Removed from your cart.",
      description: "This item has been removed from your cart.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }

  return filteredCartItems;
};

export const removeAndAllFromShoppingCartItems = (
  cartItem: IProduct[],
  shoppingCartItems: IProduct[]
) => {
  if (cartItem.length === shoppingCartItems.length) {
    toast({
      title: "Removed all products from your cart.",
      description: "All products have been removed from your cart.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    return [];
  }
  const productToRemove = shoppingCartItems.filter(
    (item) => item.id !== cartItem[0].id
  );
  toast({
    title: "Removed from your cart.",
    description: "This item has been removed from your cart.",
    status: "success",
    duration: 2000,
    isClosable: true,
  });
  return productToRemove;
};
