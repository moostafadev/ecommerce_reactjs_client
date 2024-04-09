import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store.";
import {
  addToShoppingCartItems,
  removeAndAllFromShoppingCartItems,
  removeFromShoppingCartItems,
} from "../../utils";

interface IInitialState {
  cartProduct: IProduct[];
}

const initialState: IInitialState = {
  cartProduct: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IProduct>) => {
      state.cartProduct = addToShoppingCartItems(
        action.payload,
        state.cartProduct
      );
    },
    removeFromCartQuantity: (state, action: PayloadAction<IProduct>) => {
      state.cartProduct = removeFromShoppingCartItems(
        action.payload,
        state.cartProduct
      );
    },
    removeFromCart: (state, action: PayloadAction<IProduct[]>) => {
      state.cartProduct = removeAndAllFromShoppingCartItems(
        Array.from(action.payload),
        state.cartProduct
      );
    },
  },
});

export const { addToCart, removeFromCartQuantity, removeFromCart } =
  cartSlice.actions;
export const selectCart = ({ cart }: RootState) => cart;
export default cartSlice.reducer;
