import { createContext, useContext, useState } from 'react';
import Snackbar from '../components/Snackbar.jsx';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);

  function addMessage(message, options = {}) {
    if (typeof message === 'string') {
      message = {
        text: message,
        ...options,
      };
    }

    message.id ??= crypto.randomUUID();
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  function addInfo(message, options = {}) {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'info',
        ...options,
      };
    }

    message.severity = 'info';
    addMessage(message);
  }

  function addSuccess(message, options = {}) {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'success',
        ...options,
      };
    }

    message.severity = 'success';
    addMessage(message);
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

  function addError(message, options = {}) {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'error',
        ...options,
      };
    }

    message.severity = 'error';
    addMessage(message);
  }

  return <ToastContext.Provider
    value={{
      messages, setMessages,
      addMessage,
      addInfo,
      addSuccess,
      addWarning,
      addError,
    }}
  >
    {messages.map((message) => (
      <Snackbar key={message.id} {...message} />
    ))}
    {children}
  </ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);