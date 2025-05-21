// context/SidebarContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a Context for the Sidebar state
const SidebarContext = createContext();

// Create a custom hook to use the Sidebar context
export const useSidebar = () => {
  return useContext(SidebarContext);
};

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};