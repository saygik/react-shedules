import { actions } from './action-types';

//* ****** Initial state ****************//
export const initialState = {
    schedule: null,
    tasks: [],
    users: [],
    loading: false,
    loaded: false,
    domains: [],
    selectedEvent: null
};

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.SCHEDULE_REQUEST:
            return { ...state, schedule: null, users: [], tasks: [], loaded: false, loading: true };
        case actions.SCHEDULE_SUCCESS:
            return { ...state, schedule: action.payload, loaded: true, loading: false };
        case actions.SCHEDULE_ERROR:
            return { ...state, loaded: false, loading: false };
        case actions.SCHEDULE_USERS_SUCCESS:
            return { ...state, users: action.payload };
        case actions.SCHEDULE_USERS_ERROR:
            return { ...state, users: [] };
        case actions.SCHEDULE_TASK_SELECT:
            return { ...state, selectedEvent: action.payload };
        case actions.SCHEDULE_TASK_DESELECT:
            return { ...state, selectedEvent: null };
        case actions.SCHEDULE_TASKS_REQUEST:
            return { ...state, tasks: [] };
        case actions.SCHEDULE_TASKS_SUCCESS:
            return { ...state, tasks: action.payload };
        case actions.SCHEDULE_TASK_ADD:
            return { ...state, tasks: [...state.tasks, action.payload] };
        case actions.SCHEDULE_TASK_DELETE:
            return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
        case actions.SCHEDULE_TASK_UPDATE:
            return { ...state, tasks: state.tasks.map(task => task.id === action.payload.id ? { ...task, ...action.payload } : task) };
        case actions.SCHEDULE_TASKS_ERROR:
            return { ...state, tasks: [] };
        default:
            return state;
    }
};
