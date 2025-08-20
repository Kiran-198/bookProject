import React, { createContext, useState } from 'react';

// Define light and dark theme colors
export const LightTheme = {
  background: '#f4cda1ff',
  cardBackground: '#ffffff',
  headerBackground: '#f5be84ff',
  text: '#000000',
  icon: 'black',
  scrollTopBtn: 'green',
};

export const DarkTheme = {
  background: '#1e1e1e',
  cardBackground: '#2a2a2a',
  headerBackground: '#333333',
  text: '#ffffff',
  icon: 'white',
  scrollTopBtn: '#444444',
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
