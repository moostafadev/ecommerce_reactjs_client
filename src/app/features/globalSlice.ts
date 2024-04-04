import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.";

interface IInitialState {
  isOpenCartDrawer: boolean;
  OnOpenCartDrawer: boolean;
  onCloseCartDrawer: boolean;
}

const initialState: IInitialState = {
  isOpenCartDrawer: false,
  OnOpenCartDrawer: false,
  onCloseCartDrawer: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    OnOpenCartDrawerAction: (state) => {
      state.isOpenCartDrawer = true;
      state.OnOpenCartDrawer = true;
    },
    OnCloseCartDrawerAction: (state) => {
      state.isOpenCartDrawer = false;
      state.onCloseCartDrawer = false;
    },
  },
});

export const { OnOpenCartDrawerAction, OnCloseCartDrawerAction } =
  globalSlice.actions;
export const selectGlobal = ({ global }: RootState) => global;
export default globalSlice.reducer;
