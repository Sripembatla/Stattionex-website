"use client";
import React from "react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Url from "../component/url";
import Cart from "../component/Cart";
import Profile from "../component/profile";

const ReduxWrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {Url()}
        {children}
        {/* {Cart} */}
        <Cart />
        <Profile/>
      </PersistGate>
    </Provider>
  );
};

export default ReduxWrapper;
