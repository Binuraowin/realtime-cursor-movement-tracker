import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastScreen: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    changeScreen(state, action) {
      state.lastScreen = action.payload;
    },
  },
});

export const { changeScreen } = configSlice.actions;

export default configSlice.reducer;
