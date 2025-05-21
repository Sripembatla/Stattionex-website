// redux/sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false, // Sidebar is initially closed
  isOpenProfile: false,
  isOpenFilter: false,
  isOpenCart: false

};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.isOpenCart = true;  // Open the sidebar
    },
    closeSidebar: (state) => {
      state.isOpenCart = false; // Close the sideba
    },

    profileSidebar: (state) => {
      state.isOpenProfile = true;
    },

    profileClose: (state) => {
      state.isOpenProfile = false;
    },

    openFilter: (state) => {
      state.isOpenFilter = true;
    },

    closeFilter: (state) => {
      state.isOpenFilter = false;
    },

    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen; // Toggle the sidebar open/close
    },
  },
});

// Export the actions to be used in components
export const { openSidebar, closeSidebar, toggleSidebar, profileSidebar, profileClose, openFilter, closeFilter } = sidebarSlice.actions;

export default sidebarSlice.reducer;
