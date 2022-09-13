import { actions } from './action-types';

//* ****** Initial state ****************//
export const initialState = {
    schedule: null,
    tasks:[],
    users: [],
    loading: false,
    loaded: false,
    domains: [],
    selectedDomain: -1
};

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.SCHEDULE_REQUEST:
            return { ...state, schedule: null, users: [],  tasks: [], loaded: false, loading: true };
        case actions.SCHEDULE_SUCCESS:
            return { ...state, schedule: action.payload, loaded: true, loading: false  };
        case actions.SCHEDULE_ERROR:
            return { ...state, loaded: false, loading: false  };
        case actions.SCHEDULE_USERS_SUCCESS:
            return { ...state, users: action.payload };
        case actions.SCHEDULE_USERS_ERROR:
            return { ...state, users: []} ;
        case actions.SCHEDULE_TASKS_REQUEST:
            return { ...state, tasks: []};
        case actions.SCHEDULE_TASKS_SUCCESS:
            return { ...state, tasks: action.payload};
        case actions.SCHEDULE_TASKS_ERROR:
            return { ...state, tasks: [] };
        default:
            return state;
    }
};
