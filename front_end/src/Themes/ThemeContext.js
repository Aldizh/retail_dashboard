// ThemeContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from './themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  // Apply theme background to body element
  useEffect(() => {
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.text;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};