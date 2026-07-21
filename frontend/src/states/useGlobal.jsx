import { useContext } from 'react';
import GlobalContext from './GlobalContext.jsx';

const useGlobal = () => useContext(GlobalContext);
export default useGlobal;