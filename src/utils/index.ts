import { createStandaloneToast } from "@chakra-ui/react";
import { IProduct } from "../interfaces";

const { toast } = createStandaloneToast();

export const addToShoppingCartItems = (
  cartItem: IProduct,
  shoppingCartItems: IProduct[]
) => {
  const existed = shoppingCartItems.find((item) => item.id === cartItem.id);
  if (existed) {
    toast({
      title: "Added to your cart.",
      description:
        "This item is already exists, the quantity will be increased",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    return shoppingCartItems.map((item) =>
      item.id === cartItem.id && item.quantity
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  toast({
    title: "Added to your cart.",
    status: "success",
    duration: 2000,
    isClosable: true,
  });
  return [...shoppingCartItems, { ...cartItem, quantity: 1 }];
};

export const removeFromShoppingCartItems = (
  cartItem: IProduct,
  shoppingCartItems: IProduct[]
) => {
  const updatedCartItems = shoppingCartItems.map((item) =>
    item.id === cartItem.id && item.quantity
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );
  const itemToRemove = updatedCartItems.find(
    (item) => item.id === cartItem.id && item.quantity === 0
  );
  if (itemToRemove) {
    const filteredCartItems = updatedCartItems.filter(
      (item) => item.id !== cartItem.id
    );
    toast({
      title: "Removed from your cart.",
      description: "This item has been removed from your cart.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    return filteredCartItems;
  }
  return updatedCartItems;
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
