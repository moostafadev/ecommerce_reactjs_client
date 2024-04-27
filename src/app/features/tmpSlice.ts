import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.";

const date = new Date();

interface IInitialState {
  value: number | undefined;
}

const initialState: IInitialState = {
  value: date.getDate(),
};

const tmpSlice = createSlice({
  name: "tmp",
  initialState: initialState,
  reducers: {
    generateUniqueTmp: (state) => {
      state.value = Date.now();
    },
  },
});

export const { generateUniqueTmp } = tmpSlice.actions;
export default tmpSlice.reducer;

export const selectTmpValue = (state: RootState) => state.tmp.value;
