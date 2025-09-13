import React, { createContext, useState, useContext } from 'react';

const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '', // Add this field to prevent undefined issues
    picture: '',
    email: '',
    password: '',
    phone: '',
    name: '',
    gender: '',
    date_of_birth: '',
    referredByCode: '' 
  });

  return (
    <SignupContext.Provider value={{ user, setUser }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => useContext(SignupContext);