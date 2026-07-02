import { createContext, useContext, useState } from 'react';
import Snackbar from '../components/Snackbar.jsx';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);

  function addMessage(message, options = {}) {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'info',
        ...options,
      };
    }

    message.id ??= crypto.randomUUID();
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  function addWarning(message, options = {}) {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'warning',
        ...options,
      };
    }

    message.severity = 'warning';
    addMessage(message);
  }

  return <ToastContext.Provider
    value={{
      messages, setMessages,
      addMessage,
      addWarning,
    }}
  >
    {messages.map((message) => (
      <Snackbar key={message.id} {...message} />
    ))}
    {children}
  </ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);