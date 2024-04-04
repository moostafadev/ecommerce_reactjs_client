import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../interfaces";
import { RootState } from "../store.";
import { addToShoppingCartItems } from "../../utils";

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
      // Specify the type of action.payload
      state.cartProduct = addToShoppingCartItems(
        action.payload,
        state.cartProduct
      );
    },
  },
});

export const { addToCart } = cartSlice.actions;
export const selectCart = ({ cart }: RootState) => cart;
export default cartSlice.reducer;
