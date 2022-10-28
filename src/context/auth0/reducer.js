


export const reducer = (state, action) => {
//  console.log(action);
  switch (action.type) {
    case 'GET_ACCESS_TOKEN_REQUEST':
      return {
        ...state,
        isLoading: true,
        token: '',
      };
    case 'GET_ACCESS_TOKEN_COMPLETE':
      return {
        ...state,
        isLoading: false,
        token: action.payload,
      };
    case 'GET_ACCESS_TOKEN_ERROR':
      return {
        ...state,
        isLoading: false
      };
    case 'LOGIN_STARTED':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        token:'',
        error: action.error,
      };
    case 'LOGIN_COMPLETE':
    case 'INITIALISED':
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload,
        isLoading: false,
        error: undefined,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        token:'',
        user: undefined,
      };
  }
};