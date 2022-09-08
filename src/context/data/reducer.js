import { actions } from './action-types';

//* ****** Initial state ****************//
export const initialState = {
    scheduleId: "",
    tasks:[],
    loading: false,
    loaded: false,
    domains: [],
    selectedDomain: -1
};

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.SET_MESSAGE:
            return { ...state, msg: action.payload };
        case actions.SET_SCHEDULE:
            return { ...state, scheduleId: action.payload };
        case actions.SCHEDULE_TASKS_REQUEST:
            return { ...state, tasks: [], loaded: false, loading: true };
        case actions.SCHEDULE_TASKS_SUCCESS:
            return { ...state, tasks: action.payload, loaded: true, loading: false };
        case actions.SCHEDULE_TASKS_ERROR:
            return { ...state, tasks: [], loaded: false, loading: false };
        default:
            return state;
    }
};
