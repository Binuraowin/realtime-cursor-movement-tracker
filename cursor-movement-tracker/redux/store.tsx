import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/UserSlice';


export default configureStore({
  reducer: {
    userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
