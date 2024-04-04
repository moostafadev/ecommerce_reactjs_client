import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import globalSlice from "./features/globalSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "cart",
  storage,
};

const persistedCart = persistReducer(persistConfig, cartSlice);

export const store = configureStore({
  reducer: {
    cart: persistedCart,
    global: globalSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persister = persistStore(store);
