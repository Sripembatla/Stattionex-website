import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, profileImg } = action.payload;

      state.accessToken = accessToken || state.accessToken;
      state.user = {
        ...user,
        addresses: user.addresses || [], // ✅ Ensure addresses always exist
      };

      if (profileImg) {
        state.user.profileImg = profileImg;
      }
    },

    updateBalance: (state, action) => {
      if (action.payload.balance && state.user) {
        state.user.walletBalance = action.payload.balance;
      }
    },

    logoutCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
    },

    updateAddressPrefrence: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    updateUserAddress(state, action) {
      // Ensure addresses is initialized as an empty array if undefine
      if (state.user) {
        const addresses = state.user.addresses || [];
        if (action.payload) {
          const existingAddressIndex = addresses.findIndex(
            (address) => address._id === action.payload._id
          );

          if (existingAddressIndex !== -1) {
            // Update the existing address
            state.user.addresses = addresses.map((address, index) =>
              index === existingAddressIndex
                ? { ...address, ...action.payload } // Merge updates into the existing address
                : address
            );
          } else {
            // Add the new address
            state.user.addresses = [...addresses, action.payload];
          }
        }
      }
    },


    removeUserAddress(state, action) {
      const idToRemove = action.payload._id;
      if (state.user && state.user.addresses) {
        state.user.addresses = state.user.addresses.filter(
          (address) => address._id !== idToRemove
        );
      }
    },
  },
});

export const {
  setCredentials,
  updateBalance,
  logoutCredentials,
  updateAddressPrefrence,
  updateUserAddress,
  removeUserAddress,
} = authSlice.actions;

export default authSlice.reducer;
