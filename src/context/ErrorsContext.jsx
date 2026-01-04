import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorsContext = createContext();

export const ErrorsProvider = ({ children }) => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // mapping status ke path
  const errorPaths = {
    401: "/unauthorized",
    403: "/forbidden",
    404: "/not-found",
    500: "/server-error",
  };

  const setError = (status, message) => {
    setErrors((prev) => ({
      ...prev,
      [status]: message,
    }));

    // kalau ada path untuk status ini → redirect
    if (errorPaths[status]) {
      navigate(errorPaths[status]);
    }
  };

  const clearError = (status) => {
    setErrors((prev) => ({
      ...prev,
      [status]: null,
    }));
  };

  return (
    <ErrorsContext.Provider value={{ errors, setError, clearError }}>
      {children}
    </ErrorsContext.Provider>
  );
};

export const useErrors = () => useContext(ErrorsContext);