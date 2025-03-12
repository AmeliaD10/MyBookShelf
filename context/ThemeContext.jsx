import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [bgColor, setBgColor] = useState("#F8F1FF");
  const [fontFamily, setFontFamily] = useState("System");
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    setBgColor((prev) => (prev === "#1E1E1E" ? "#F7E7CE" : "#1E1E1E"));
  };

  // Function to reset all settings
  const resetSettings = () => {
    setBgColor("#F7E7CE");
    setFontFamily("System");
    setDarkMode(false);
  };

  return (
    <ThemeContext.Provider value={{ bgColor, setBgColor, fontFamily, setFontFamily, darkMode, toggleDarkMode, resetSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
