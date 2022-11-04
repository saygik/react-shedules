import { useReducer, useContext, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../api';
import { reducer, initialState } from './reducer';
import DataContext from './context';
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

    const getExtendedPropertys = useCallback((ev) => {
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
    }, [state.users]);

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

    const addTask = useCallback(async (event) => {
        const dateStartString = createStringDate(event.start)
        const dateEndString = createEndDateNew(event.start, event.startDate, event.endDate, event.allDay)
        const allDay = event.allDay === undefined ? 'true' : event.allDay

        try {
            const result = await api.addTask(event.id, event.title, event.extendedProps.id, dateStartString, dateEndString, allDay.toString(), '')
            if (result.status === 200) {
                //                const newTask=getExtendedPropertys(result.data.data)
                dispatch({ type: actions.SCHEDULE_TASK_ADD, payload: result.data.data })
                toast.info('Событие добавлено!');
            } else {
                toast.error('Событие не добавлено!');
            }
        } catch (e) {
            console.log('err', e)
            toast.error('Событие не добавлено!');
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps


    //* **************************  Selectors  *********************//

    const selectors = {};
    selectors.searchValue = useMemo(() => state.searchValue, [state.searchValue]);
    selectors.tasks = useMemo(() => state.tasks.map(ev => getExtendedPropertys(ev)), [state.tasks, state.users])
    //    console.log('state.tasks', state.tasks)

    //* *******************************************************************************************************//
    const value = {
        state,
        selectors,
        deleteTask,
        updateTask,
        addTask,
        dispatch
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
