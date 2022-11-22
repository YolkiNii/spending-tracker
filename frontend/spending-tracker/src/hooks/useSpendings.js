import { useContext } from 'react';
import SpendingsContext from '../context/SpendingsProvider';

const useSpendings = () => {
    return useContext(SpendingsContext);
}

export default useSpendings;