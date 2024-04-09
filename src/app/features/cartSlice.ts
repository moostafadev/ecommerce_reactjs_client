import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ICart, IProduct } from "../../interfaces";
import { RootState } from "../store.";
import {
  addToShoppingCartItems,
  removeAndAllFromShoppingCartItems,
  removeFromShoppingCartItems,
} from "../../utils";
import { getCart } from "../../api/cartApis";

interface IInitialState {
  cartProduct: IProduct[];
}

const initialState: IInitialState = {
  cartProduct: [],
};

export const fetchCartData = createAsyncThunk(
  "cart/fetchCartData",
  async () => {
    const response = await getCart();
    return response.map((res: ICart) => res?.attributes?.products?.data[0]);
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchCartData.fulfilled, (state, action) => {
      state.cartProduct = action.payload;
    });
  },
});

export const { addToCart, removeFromCartQuantity, removeFromCart } =
  cartSlice.actions;
export const selectCart = ({ cart }: RootState) => cart;
export default cartSlice.reducer;
