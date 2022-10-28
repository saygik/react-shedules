import { useCallback, useContext, useMemo, useEffect } from 'react';
import DataContext from './context';
import api from "../../api";
import { actions } from './action-types';
import {  toast } from 'react-toastify';

export default function useShedules() {
    const useData = () => useContext(DataContext);
    const {
        state,
        dispatch
    } = useData();

    const schedule= useMemo(() => state.schedule, [state.schedule]);
    const users= useMemo(() => state.users, [state.users]);

    const getScheduleTasks = useCallback(async (id)=>{
        dispatch({ type: actions.SCHEDULE_TASKS_REQUEST })
        try {
            const result = await api.getScheduleTasks(id)
            if (result && result.status===200) {
                dispatch({ type: actions.SCHEDULE_TASKS_SUCCESS, payload: result.data.data })
            } else {
                dispatch({ type: actions.SCHEDULE_TASKS_ERROR })
                toast.error('Невозмозно получить задания  расписания с сервера:');            
            }
        } catch (err) {
            dispatch({ type: actions.SCHEDULE_TASKS_ERROR })
            toast.error('Невозмозно получить задания  расписания с сервера:'+ err.message,{autoClose:5000} );            

        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const getSchedule = useCallback(async (id)=>{
        dispatch({ type: actions.SCHEDULE_REQUEST})
        try {
            const result = await api.getSchedule(id)
            if (result && result.status===200) {
                dispatch({ type: actions.SCHEDULE_SUCCESS, payload: result.data.data })
            } else {
                toast.error('Невозмозно получить расписание с сервера',{autoClose:5000});            
                dispatch({ type: actions.SCHEDULE_ERROR })
            }
        } catch (err) {
            toast.error('Невозмозно получить расписание с сервера:'+ err.message,{autoClose:5000} );
            dispatch({ type: actions.SCHEDULE_ERROR })
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const getScheduleUsers = useCallback(async (schedule)=>{
        try {
            const result = await api.getAdUserInGroup(schedule.domain || "", schedule.usergroup || "")
            if (result && result.status===200) {
                dispatch({ type: actions.SCHEDULE_USERS_SUCCESS, payload: result.data.data })
            } else {
                dispatch({ type: actions.SCHEDULE_USERS_ERROR })
                toast.error('Невозмозно получить пользователей расписания с сервера:');            
            }
        } catch (err) {
            dispatch({ type: actions.SCHEDULE_USERS_ERROR })
            toast.error('Невозмозно получить пользователей расписания с сервера:'+ err.message,{autoClose:5000} );

        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!schedule) return
        if (schedule.tip==="1"){
            getScheduleUsers(schedule)
            getScheduleTasks(schedule.id)
        }
        
        
    }, [schedule]);

    const sortedUsers=useMemo(()=>{
        return users.sort((a,b) => {
            const fa = a.displayName.toLowerCase();
            const fb = b.displayName.toLowerCase();
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        })
    },[users])


    const login = async()=>{
        const result = await api.login()
    }

    return {
        login,
        name: schedule  && (schedule.name || ""),
        loading: state.loading,
        loaded: state.loaded,
        tasks: state.tasks,
        users,
        sortedUsers,
        getScheduleTasks,
        getSchedule
    };
}
