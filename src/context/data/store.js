import {useReducer, useContext, useEffect, useMemo, useCallback} from 'react';
import api from '../../api';
import { reducer, initialState } from './reducer';
import DataContext from './context';



export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);


    useEffect(
        () => {

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );


    //* **************************  Selectors  *********************//

    const selectors = {};
    selectors.searchValue = useMemo(() => state.searchValue, [state.searchValue]);
    //* *******************************************************************************************************//
    const value = {
        state,
        selectors,
        dispatch
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
