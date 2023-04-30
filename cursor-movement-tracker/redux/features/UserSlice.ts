import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  username: string;
}

const initialState: AppState = {
  username: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = appSlice.actions;

export default appSlice.reducer;


