import { useContext } from 'react';
import ToastContext from './ToastContext.jsx';

const useToast = () => useContext(ToastContext);
export default useToast;