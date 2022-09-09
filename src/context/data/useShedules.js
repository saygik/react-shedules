import { useCallback, useContext } from 'react';
import DataContext from './context';
import api from "../../api";
import { actions } from './action-types';

export default function useShedules() {
    const useData = () => useContext(DataContext);
    const {
        state,
        dispatch
    } = useData();


    const getScheduleTasks = useCallback(async (id)=>{
        dispatch({ type: actions.SCHEDULE_TASKS_REQUEST })
        try {
            const result = await api.getScheduleTasks(id)
            if (result && result.status===200) {
                dispatch({ type: actions.SCHEDULE_TASKS_SUCCESS, payload: result.data.data })
            } else {
                dispatch({ type: actions.SCHEDULE_TASKS_ERROR })
            }
        } catch (err) {
            dispatch({ type: actions.SCHEDULE_TASKS_ERROR })
            dispatch({ type: actions.SET_MESSAGE, payload: "Ошибка получения запроса" })
            setTimeout(dispatch({ type: actions.SET_MESSAGE, payload: "" }), 1000)
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const getSchedule = useCallback(async (id)=>{
        try {
            const result = await api.getSchedule(id)
            if (result && result.status===200) {
                console.log('result',result);
//                dispatch({ type: actions.SCHEDULE_TASKS_SUCCESS, payload: result.data.data })
            } else {
//                dispatch({ type: actions.SCHEDULE_TASKS_ERROR })
            }
        } catch (err) {
//            dispatch({ type: actions.SCHEDULE_TASKS_ERROR })
//            dispatch({ type: actions.SET_MESSAGE, payload: "Ошибка получения запроса" })
//            setTimeout(dispatch({ type: actions.SET_MESSAGE, payload: "" }), 1000)
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    // useEffect(() => {
    //     if (!usersRequest) return
        
        
    // }, [usersRequest]);
    
    // const getUsers=async () => {
    //     const result = await api.getAdUserInGroup("brnv.rw", "CN=adusersDomainAdmins,OU=WWW-ADUSERS,OU=Служебные пользователи,OU=_Служебные записи,DC=brnv,DC=rw")
    //     if (result && result.status===200) {
    //         setUsers(result.data.data)
    //     }
    // }


    return {
        tasks: state.tasks,
        getScheduleTasks,
        getSchedule
    };
}
