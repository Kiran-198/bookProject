// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './Book/BookSlice';

const store = configureStore({
  reducer: {
    books: bookReducer,
  },
});

export default store; 
