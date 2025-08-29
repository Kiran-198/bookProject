import React, { createContext, useState } from 'react';
// Define light and dark theme colors
export const LightTheme = {
  background: '#f5be84ff',
  cardBackground: '#f4cda1ff',
  headerBackground: '#f5be84ff',
  text: '#000000',
  icon: 'black',
  scrollTopBtn: 'green',
  borderColor:'black',
};

export const DarkTheme = {
  background: '#3d3d3dff',
  cardBackground: '#666464ff',
  headerBackground: '#3d3d3dff',
  text: '#ffffff',
  icon: 'white',
  scrollTopBtn: '#444444',
  borderColor:'white',
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const theme = isDarkTheme ? DarkTheme : LightTheme;

  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
