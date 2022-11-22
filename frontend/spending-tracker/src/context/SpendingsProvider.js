import { createContext, useState } from "react";

const SpendingsContext = createContext([]);

export const SpendingsProvider = ({children}) => {
    const [spendingInfos, setSpendingInfos] = useState([]);

    return (
        <SpendingsContext.Provider value={{spendingInfos, setSpendingInfos}}>
            {children}
        </SpendingsContext.Provider>
    )
}

export default SpendingsContext;