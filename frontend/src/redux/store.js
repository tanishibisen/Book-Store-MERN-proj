import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookReducer from './bookSlice';
import tradeReducer from './tradeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    trades: tradeReducer,
  },
});

export default store;
