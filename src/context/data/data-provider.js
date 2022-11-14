import { useReducer, useContext, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import { reducer, initialState } from './reducer';
import DataContext from './data-context';
import { actions } from './action-types';
import { createEndDate, createEndDateNew, createStringDate } from './utils';



export const DataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);


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

    const getExtendedPropertys = (ev) => {
        if (!ev) return ev
        let newEvent = { ...ev, allDay: ev.all_day === 'true', extendedProps: { id: ev.upn, comment: ev.comment } }
        delete newEvent.upn
        delete newEvent.idc
        delete newEvent.all_day
        delete newEvent.comment
        if (!state.users) return newEvent
        const ADUserFinded = state.users.find(user => (user.userPrincipalName === newEvent.extendedProps.id))
        if (!ADUserFinded) {
            newEvent.extendedProps.notfound = true
            return newEvent
        }
        newEvent.title = ADUserFinded.displayName
        newEvent.extendedProps.telephoneNumber = ADUserFinded.telephoneNumber
        newEvent.extendedProps.title = ADUserFinded.title
        newEvent.extendedProps.mobile = ADUserFinded.mobile
        newEvent.extendedProps.notfound = false
        return newEvent
    };

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


    const updateTask = useCallback(async (event) => {

        const dateStartString = createStringDate(event.start) //dayjs(event.start).format(!event.allDay ? 'DD.MM.YYYY' : 'YYYY-MM-DDTHH:mm:ssZ')
        const dateEndString = !event.end
            ? createEndDateNew(event.start, event._instance.range.start, event._instance.range.end, event.allDay)
            : createEndDate(event.start, event.end, event.allDay)

        try {
            const result = await api.updateTask(event.id, dateStartString, dateEndString, event.allDay.toString(), event.extendedProps.comment)
            if (result.status === 200) {
                dispatch({ type: actions.SCHEDULE_TASK_UPDATE, payload: { id: event.id, start: dateStartString, end: dateEndString, allDay: event.allDay.toString(), comment: event.extendedProps.comment } })
                toast.info('Событие изменено!');
            }
        } catch (e) {
            console.log('err', e)
            toast.error('Событие не изменено!');
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const addTask = useCallback(async (event, andEdit = false) => {
        const dateStartString = createStringDate(event.start)
        const dateEndString = createEndDateNew(event.start, event.startDate, event.endDate, event.allDay)
        const allDay = event.allDay === undefined ? 'true' : event.allDay

        try {
            const result = await api.addTask(event.id, event.title, event.extendedProps.id, dateStartString, dateEndString, allDay.toString(), '')
            if (result.status === 200) {
                dispatch({ type: actions.SCHEDULE_TASK_ADD, payload: result.data.data })

                andEdit && selectTask({
                    id: result.data.data.id,
                })
                toast.info('Событие добавлено!');
            } else {
                toast.error('Событие не добавлено!');
            }
        } catch (e) {
            console.log('err', e)
            toast.error('Событие не добавлено!');
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const selectTask = useCallback(task => dispatch({ type: actions.SCHEDULE_TASK_SELECT, payload: task }), [])
    const deselectTask = useCallback(() => dispatch({ type: actions.SCHEDULE_TASK_DESELECT }), [])

    //* **************************  Selectors  *********************//
    const users = useMemo(() => state.users, [state.users]);
    const schedule = useMemo(() => state.schedule, [state.schedule]);

    const selectors = {};
    selectors.loading = useMemo(() => state.loading, [state.loading]);
    selectors.loaded = useMemo(() => state.loaded, [state.loaded]);
    selectors.editTaskOpen = useMemo(() => !!state.selectedEvent, [state.selectedEvent]);
    selectors.scheduleName = useMemo(() => schedule && (schedule.name || ""), [schedule]);
    selectors.searchValue = useMemo(() => state.searchValue, [state.searchValue]);
    selectors.tasks = useMemo(() => state.tasks.map(ev => getExtendedPropertys(ev)), [state.tasks, state.users]);// eslint-disable-line react-hooks/exhaustive-deps

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
    //    console.log('state.tasks', state.tasks)
    const selectedEvent = useMemo(() => {
        if (!state.selectedEvent) return null

        if (state.selectedEvent.id===0) return  state.selectedEvent
        const event=selectors.tasks.find(task=>task.id===state.selectedEvent.id.toString())
        if (!event) return null
        const selected={
            id:event.id,
            allDay:event.allDay,
            start:event.start,
            end:event.end,
            name: event.title,
            event: event.extendedProps
        }
       // console.log('selected', selected)
        //        const newTask=getExtendedPropertys(result.data.data)
                return selected
            }, [state.selectedEvent, selectors.tasks]);
        
    //* *******************************************************************************************************//
    const value = {
        state,
        selectedEvent,
        selectors,
        deleteTask,
        updateTask,
        getSchedule,
        addTask,
        selectTask,
        deselectTask
        //        dispatch
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
