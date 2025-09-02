// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore,persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bookReducer from './Book/BookSlice';

const persistConfig={
  key:'books',
  storage: AsyncStorage,
  whitelist:['localBooks'] 
}
const persistedReducer=persistReducer(persistConfig,bookReducer)
// const store = configureStore({
//   reducer: {
//     books: bookReducer,
//   },
// });

// export default store; 

export const store = configureStore({
  reducer: {
    books: persistedReducer, // wrap your single reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // avoid redux-persist warnings
    }),
});

export const persistor = persistStore(store)
