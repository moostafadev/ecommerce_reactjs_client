import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  OnCloseCartDrawerAction,
  selectGlobal,
} from "../app/features/globalSlice";
import React from "react";
import { removeFromCart, selectCart } from "../app/features/cartSlice";
import CartDrawerItems from "./CartDrawerItems";

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { isOpenCartDrawer } = useSelector(selectGlobal);
  const { cartProduct } = useSelector(selectCart);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const onClose = () => dispatch(OnCloseCartDrawerAction());

  const removeAllItemsHandler = () => {
    dispatch(removeFromCart(cartProduct));
  };
  const prices = cartProduct.map(
    (item) =>
      item.attributes.price &&
      item.attributes.discountPercentage &&
      item.quantity &&
      Math.ceil(
        (item.attributes.price - item.attributes.discountPercentage) *
          item.quantity
      )
  );
  const countPrices =
    prices.length && prices.reduce((prev, cur) => prev && cur && prev + cur);

  const items = cartProduct.map((item) => item.quantity);
  const countItems =
    items.length && items.reduce((prev, cur) => prev && cur && prev + cur);

  return (
    <Drawer
      isOpen={isOpenCartDrawer}
      placement="right"
      onClose={onClose}
      finalFocusRef={cancelRef}
    >
      <DrawerOverlay />
      <DrawerContent maxW={"30rem"}>
        <DrawerCloseButton />
        <DrawerHeader>Your Shopping Cart</DrawerHeader>

        <DrawerBody>
          {cartProduct?.map((item, idx) => (
            <CartDrawerItems
              key={idx}
              id={item.id}
              attributes={item.attributes}
              quantity={item.quantity}
            />
          ))}
        </DrawerBody>

        <DrawerFooter justifyContent={"space-between"}>
          {cartProduct.length ? (
            <>
              <Flex flexDir={"column"} gap={"8px"}>
                <Text>All price: ${countPrices} USD</Text>
                <Text>
                  Quantity items: {countItems}{" "}
                  {countItems && countItems < 2 ? "Item" : "Items"}
                </Text>
              </Flex>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={removeAllItemsHandler}
              >
                Clear all
              </Button>
            </>
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
