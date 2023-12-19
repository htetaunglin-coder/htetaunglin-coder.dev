// import { useState, useEffect, createContext, useContext } from "react";

// export const ThemeContext = createContext();

// export const ThemeContextProvider = ({ children }) => {
//   const [theme, setTheme] = useState("dark");
//   const htmlEl = document.getElementsByTagName("html");

//   useEffect(() => {
//     const data = localStorage.getItem("theme");
//     if (data) {
//       return setTheme(data);
//     }
//     htmlEl.classList.add(theme);
//     setTheme(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = ({ theme }) => {
//     localStorage.theme = theme == "dark" ? "light" : "dark";
//   };

//   const value = {
//     theme,
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
//   );
// };

// export const useThemeContext = () => useContext(ThemeContext);
