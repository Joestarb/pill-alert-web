import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../slices/themeSlice";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggleButton: React.FC = () => {
  const dispatch = useDispatch();
  interface RootState {
    theme: {
      theme: string;
    };
  }

  const theme = useSelector((state: RootState) => state.theme.theme);

  // Cambiar la clase del body según el tema
  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(theme === "light" ? "theme-light" : "theme-dark");
  }, [theme]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`flex items-center justify-center w-10 h-10 rounded-full z-50 transition-all duration-300 ease-in-out ${
        theme === "light"
          ? " hover:bg-gray-200 text-yellow-500"
          : "bg-gray-700 hover:bg-gray-600 text-blue-300"
      } shadow-md ${
        theme === "light" ? "hover:shadow-lg" : "hover:shadow-lg"
      } focus:outline-none focus:ring-2 ${
        theme === "light"
          ? "focus:ring-yellow-400"
          : "focus:ring-blue-500"
      }`}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <FaSun 
        className="w-6 h-6 transition-transform duration-300 hover:rotate-45"
        />
        
      ) : (
       <FaMoon
        className="w-6 h-6 transition-transform duration-300 hover:rotate-45"
       />
      )}
    </button>
  );
};

export default ThemeToggleButton;