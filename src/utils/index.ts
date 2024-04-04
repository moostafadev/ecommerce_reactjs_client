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
      item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item
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
