import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  OnCloseCartDrawerAction,
  selectGlobal,
} from "../app/features/globalSlice";
import React from "react";

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { isOpenCartDrawer } = useSelector(selectGlobal);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const onClose = () => dispatch(OnCloseCartDrawerAction());

  return (
    <Drawer
      isOpen={isOpenCartDrawer}
      placement="right"
      onClose={onClose}
      finalFocusRef={cancelRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Your Shopping Cart</DrawerHeader>

        <DrawerBody></DrawerBody>

        <DrawerFooter>
          <Button colorScheme="red" variant="outline" mr={3} onClick={onClose}>
            Clear all
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
