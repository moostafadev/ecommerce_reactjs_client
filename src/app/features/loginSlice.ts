import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/axios.config";
import { RootState } from "../store.";
import { IUser } from "../../interfaces";
import { createStandaloneToast } from "@chakra-ui/react";
import cookieServices from "../../services/cookieServices";

interface IInitialState {
  data: IUser;
  loading: boolean;
  error: null | unknown;
}

const initialState: IInitialState = {
  data: { identifier: "", password: "" },
  loading: false,
  error: null,
};

const { toast } = createStandaloneToast();

export const userLogin = createAsyncThunk(
  "login/userLogin",
  async (user: IUser, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const { data } = await axiosInstance.post("/auth/local", user);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
      const date = new Date();
      const IN_DAYES = 5;
      const EXPIRES_IN_DAYES = date.getTime() + 1000 * 60 * 60 * 24 * IN_DAYES;
      date.setTime(EXPIRES_IN_DAYES);
      const options = {
        path: "/",
        expires: date,
      };
      cookieServices.set("jwt", action.payload.jwt, options);
      toast({
        title: "Login Successful",
        description: "Welcome back! You have successfully logged in.",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.replace("/");
      }, 1000);
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.loading = false;
      state.data = { identifier: "", password: "" };
      state.error = action.payload as Error;
      if (action.payload instanceof Error) {
        toast({
          title: "Invalid email or password.",
          description:
            "Unable to log in. Please double-check your email and password and try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    });
  },
});

export const selectLogin = ({ login }: RootState) => login;
export default loginSlice.reducer;
