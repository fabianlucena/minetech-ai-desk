import { createContext, useContext } from "react";

const FormContext = createContext();

export const useForm = () => useContext(FormContext);

export const FormProvider = ({ onSubmit, onCancel, children }) => (
  <FormContext.Provider value={{ onSubmit, onCancel }}>
    {children}
  </FormContext.Provider>
);
