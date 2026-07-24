import { useState, useCallback, useMemo } from 'react';
import Snackbar from '../components/Snackbar.jsx';
import ToastContext from './ToastContext.jsx';

export default function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((message, options = {}) => {
    if (typeof message === 'string') {
      message = {
        text: message,
        ...options,
      };
    }

    message.id ??= crypto.randomUUID();
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const addInfo = useCallback((message, options = {}) => {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'info',
        ...options,
      };
    }

    message.severity = 'info';
    addMessage(message);
  }, [addMessage]);

  const addSuccess = useCallback((message, options = {}) => {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'success',
        ...options,
      };
    }

    message.severity = 'success';
    addMessage(message);
  }, [addMessage]);

  const addWarning = useCallback((message, options = {}) => {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'warning',
        ...options,
      };
    }

    message.severity = 'warning';
    addMessage(message);
  }, [addMessage]);

  const addError = useCallback((message, options = {}) => {
    if (typeof message === 'string') {
      message = {
        text: message,
        severity: 'error',
        ...options,
      };
    }

    message.severity = 'error';
    addMessage(message);
  }, [addMessage]);

  const value = useMemo(() => ({
    messages, setMessages,
    addMessage,
    addInfo,
    addSuccess,
    addWarning,
    addError,
  }), [messages, setMessages, addMessage, addInfo, addSuccess, addWarning, addError]);

  return <ToastContext.Provider value={value} >
    {messages.map((message) => (
      <Snackbar key={message.id} {...message} />
    ))}
    {children}
  </ToastContext.Provider>;
}