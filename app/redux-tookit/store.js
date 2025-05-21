import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { authApi } from './services/authApi';
import authReducer, { locationReducer } from './features/authSlice';
import cartReducer from './cart/cartSlicer';
import { productService } from './services/productService';
import { homeService } from './services/homeService';
import sidebarReducer from  './features/sidebarSlice'

// 1. Configure persist settings
const persistConfig = {
  key: 'auth',
  storage,
  // whitelist: ['token', 'user']
  whitelist: ['auth', 'cart', 'location']
};

// 2. Wrap authReducer with persistReducer
const persistedAuthReducer = persistReducer(
  { key: 'auth', storage },
  authReducer
);
const persistedCartReducer = persistReducer(
  { key: 'cart', storage },
  cartReducer
);

// 3. Combine reducers
const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [productService.reducerPath]: productService.reducer,
  [homeService.reducerPath]: homeService.reducer,
  auth: persistedAuthReducer,
  cart: persistedCartReducer,
  location: locationReducer,
  sidebar: sidebarReducer,
});

// 4. Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(productService.middleware)
      .concat(homeService.middleware)
      .concat(authApi.middleware),
  devTools: true,
});

// 5. Setup persistence
export const persistor = persistStore(store);

// 6. Optionally enable query listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);
