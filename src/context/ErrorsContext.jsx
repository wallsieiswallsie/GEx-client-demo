import React, { createContext, useState, useContext, useCallback } from 'react';

export const ErrorsContext = createContext();

export const ErrorsProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  // Fungsi untuk menambahkan error baru
  const addError = useCallback((message, type = 'error') => {
    const id = Date.now();
    setErrors((prevErrors) => [...prevErrors, { id, message, type }]);

    // Auto hapus pesan error setelah 5 detik
    setTimeout(() => {
      removeError(id);
    }, 5000);
  }, []);

  // Fungsi untuk menghapus error spesifik
  const removeError = useCallback((id) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  }, []);

  // Fungsi untuk membersihkan semua error
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorsContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
      
      {/* Opsional: Render Toast/Alert disini untuk global error handling, 
          atau buat komponen terpisah yang memanggil useErrors(). */}
    </ErrorsContext.Provider>
  );
};

// Custom hook helper
export const useErrors = () => useContext(ErrorsContext);
