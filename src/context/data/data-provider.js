import { useReducer, useContext, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import { reducer, initialState } from './reducer';
import DataContext from './data-context';
import { actions } from './action-types';
import { createEndDate, createEndDateNew, createStringDate, addDay, createStringDates, getExtendedPropertys } from './utils';



export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    //* **************************  Selectors  Section Start *********************//
    const users = useMemo(() => state.users, [state.users]);
    const schedule = useMemo(() => state.schedule, [state.schedule]);


    const selectors = {};
    selectors.loading = useMemo(() => state.loading, [state.loading]);
    selectors.loaded = useMemo(() => state.loaded, [state.loaded]);
    selectors.editTaskOpen = useMemo(() => !!state.selectedEvent, [state.selectedEvent]);
    selectors.scheduleName = useMemo(() => schedule && (schedule.name || ""), [schedule]);
    selectors.searchValue = useMemo(() => state.searchValue, [state.searchValue]);
    selectors.tasks = useMemo(() => state.tasks.map(ev => getExtendedPropertys(ev,users)), [state.tasks, users]);// eslint-disable-line react-hooks/exhaustive-deps
    selectors.sortedUsers = useMemo(() => {
        return users.sort((a, b) => {
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
    }, [users])

    const selectedEvent = useMemo(() => {
        if (!state.selectedEvent) return null

        if (state.selectedEvent.id === 0) {
            const endNew = createEndDateNew(state.selectedEvent.start, state.selectedEvent.startDate, state.selectedEvent.endDate)
            const selected = {
                ...state.selectedEvent,
                end: endNew
            }
            delete selected.startDate
            delete selected.endDate
            return selected
        }
        const event = selectors.tasks.find(task => task.id === state.selectedEvent.id.toString())
        if (!event) return null
        const selected = {
            id: event.id,
            allDay: event.allDay,
            start: event.start,
            end: event.end,
            name: event.title,
            event: event.extendedProps
        }
        // console.log('selected', selected)
        //        const newTask=getExtendedPropertys(result.data.data)
        return selected
    }, [state.selectedEvent, selectors.tasks]);

    //* **************************  Selectors Section End  *********************//

    useEffect(
        () => {

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        if (!state.schedule) return
        if (state.schedule.tip === "1") {
            getScheduleUsers(state.schedule)
            getScheduleTasks(state.schedule.id)
        }
    }, [state.schedule]);// eslint-disable-line react-hooks/exhaustive-deps

    const getScheduleTasks = useCallback(async (id) => {
        dispatch({ type: actions.SCHEDULE_TASKS_REQUEST })
        try {
            const result = await api.getScheduleTasks(id)
            if (result && result.status === 200) {
                dispatch({ type: actions.SCHEDULE_TASKS_SUCCESS, payload: result.data.data })
            } else {
                dispatch({ type: actions.SCHEDULE_TASKS_ERROR })
                toast.error('Невозмозно получить задания  расписания с сервера:');
            }
        } catch (err) {
            dispatch({ type: actions.SCHEDULE_TASKS_ERROR })
            toast.error('Невозмозно получить задания  расписания с сервера:' + err.message, { autoClose: 5000 });

        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const getSchedule = useCallback(async (id) => {
        dispatch({ type: actions.SCHEDULE_REQUEST })
        try {
            const result = await api.getSchedule(id)
            if (result && result.status === 200) {
                dispatch({ type: actions.SCHEDULE_SUCCESS, payload: result.data.data })
            } else {
                toast.error('Невозмозно получить расписание с сервера', { autoClose: 5000 });
                dispatch({ type: actions.SCHEDULE_ERROR })
            }
        } catch (err) {
            toast.error('Невозмозно получить расписание с сервера:' + err.message, { autoClose: 5000 });
            dispatch({ type: actions.SCHEDULE_ERROR })
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps




    const getScheduleUsers = useCallback(async (schedule) => {
        try {
            const result = await api.getAdUserInGroup(schedule.domain || "", schedule.usergroup || "")
            if (result && result.status === 200) {
                dispatch({ type: actions.SCHEDULE_USERS_SUCCESS, payload: result.data.data })
            } else {
                dispatch({ type: actions.SCHEDULE_USERS_ERROR })
                toast.error('Невозмозно получить пользователей расписания с сервера:');
            }
        } catch (err) {
            dispatch({ type: actions.SCHEDULE_USERS_ERROR })
            toast.error('Невозмозно получить пользователей расписания с сервера:' + err.message, { autoClose: 5000 });

        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps    

    
    const deleteTask = useCallback(async (id) => {
        try {
            const result = await api.deleteTask(id)
            if (result.status === 200) {
                dispatch({ type: actions.SCHEDULE_TASK_DELETE, payload: id })
                toast.info('Событие удалено!',);
            }
        } catch (e) {
            console.log('err', e)
            toast.error('Событие не удалено!');
        }
        return ""
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const updateTask = useCallback(async (task) => {
        const newDates = createStringDates(task.start, task.end, task.allDay, 1)
        try {
            //(id, tip, status, title, start,end, all_day,sendMattermost ,comment)
            const result = await api.updateTask(
                task.id,
                task.tip.toString(),
                task.status.toString(),
                task.name,
                newDates.start,
                newDates.end,
                task.allDay.toString(),
                task.sendToMattermost.toString(),
                task.comment
            )
            if (result.status === 200) {
                dispatch({
                    type: actions.SCHEDULE_TASK_UPDATE,
                    payload: {
                        id: task.id,
                        tip: task.tip.toString(),
                        status: task.status.toString(),
                        start: newDates.start,
                        end: newDates.end,
                        all_day: task.allDay.toString(),
                        send_mattermost: task.sendToMattermost.toString(),
                        comment: task.comment
                    }
                })
                dispatch({ type: actions.SCHEDULE_TASK_DESELECT })
                toast.info('Событие изменено!');
            }
        } catch (e) {
            console.log('err', e)
            toast.error('Событие не изменено!');
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const updateTaskFromCalendarEvent = useCallback(async (event) => {
        const newEndDate = createEndDateNew(event.start, event._instance.range.start, event._instance.range.end)
        const newDates = createStringDates(event.start, newEndDate, event.allDay, 0)

        try {
            //            const result = await api.updateTask(event.id, dateStartString, dateEndString, event.allDay.toString(), event.extendedProps.comment)
            const result = await api.updateTask(
                event.id,
                event.extendedProps.tip.toString(),
                event.extendedProps.status.toString(),
                event.title,
                newDates.start,
                newDates.end,
                event.allDay.toString(),
                event.extendedProps.sendMattermost,
                event.extendedProps.comment
            )
            if (result.status === 200) {
                dispatch({
                    type: actions.SCHEDULE_TASK_UPDATE,
                    payload: {
                        id: event.id,
                        start: newDates.start,
                        end: newDates.end,
                        all_day: event.allDay.toString()
                    }
                })
                toast.info('Событие изменено!');
            }
        } catch (e) {
            console.log('err', e)
            toast.error('Событие не изменено!');
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const addTask = useCallback(async (task) => {

        const newDates = createStringDates(task.start, task.end, task.allDay, 1)
        try {
            const result = await api.addTask(
                schedule.id,
                task.tip.toString(),
                task.status.toString(),
                task.name,
                task.upn || "",
                newDates.start,
                newDates.end,
                task.allDay.toString(),
                task.sendToMattermost.toString(),
                task.comment
            )
            if (result.status === 200) {
                dispatch({ type: actions.SCHEDULE_TASK_ADD, payload: result.data.data })
                dispatch({ type: actions.SCHEDULE_TASK_DESELECT })
                toast.info('Событие добавлено!');
            } else {
                toast.error('Событие не добавлено!');
            }
        } catch (e) {
            console.log('err', e)
            toast.error('Событие не добавлено!');
        }
    }, [schedule]);// eslint-disable-line react-hooks/exhaustive-deps

    const selectTask = useCallback(task => dispatch({ type: actions.SCHEDULE_TASK_SELECT, payload: task }), [])
    const deselectTask = useCallback(() => dispatch({ type: actions.SCHEDULE_TASK_DESELECT }), [])


    //* *******************************************************************************************************//
    const value = {
        state,
        selectedEvent,
        selectors,
        deleteTask,
        updateTask,
        updateTaskFromCalendarEvent,
        getSchedule,
        addTask,
        selectTask,
        deselectTask
        //        dispatch
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
