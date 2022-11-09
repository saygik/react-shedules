import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Auth0Client
} from '../../auth0client'
import Auth0Context from './auth0-context';
import { reducer } from './reducer';
import { initialAuthState } from './auth-state';
import { loginError } from './utils';


/**
* ```jsx
* <Auth0Provider
*   domain={domain}
*   clientId={clientId}
*   redirectUri={window.location.origin}>
*   <MyApp />
* </Auth0Provider>
* ```
*
* Provides the Auth0Context to its child components.
*/
const Auth0Provider = (opts) => {
  const {
    children,
    onRedirectCallbackComplate,
    getCurrentLocation,
    ...clientOpts
  } = opts;
  const [client] = useState(
    () => new Auth0Client(clientOpts)
  );
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const didInitialise = useRef(false);

  useEffect(() => {
    const token= localStorage.getItem('REACT_APPS_USER_TOKEN')
    token && dispatch({ type: 'GET_ACCESS_TOKEN_COMPLETE', payload: token })
  }, [])
  // useEffect(() => {
  //     if (didInitialise.current) {
  //       return;
  //     }
  //     didInitialise.current = true;
  //     (async () => {
  //       try {
  //         let user;
  //           const { appState } = await client.loginWithPopup();
  //         dispatch({ type: 'INITIALISED', user });
  //       } catch (error) {
  //         dispatch({ type: 'ERROR', error: loginError(error) });
  //       }
  //     })();
  //   }, [client]);

  const loginWithRedirect = useCallback(() =>{
    const location= getCurrentLocation()
    client.loginWithRedirect(location)
  },[]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
      if (didInitialise.current) {
        return;
      }
    client.token=state.token
    localStorage.setItem('REACT_APPS_USER_TOKEN', state.token);
    !!state.token && onTokenChange()
  }, [state.token]);// eslint-disable-line react-hooks/exhaustive-deps

  //console.log('client.token',client.token)
  const logout = useCallback(() =>{
      client.logout();
      dispatch({ type: 'LOGOUT' })},
    []);// eslint-disable-line react-hooks/exhaustive-deps

  const onTokenChange = useCallback(
    async () => {
      dispatch({ type: 'LOGIN_STARTED' });
      try {
        console.log('---------------------------');
        const resultUser = await client.getCurrentUserID();
        console.log('resultUser',resultUser);
        if (resultUser && resultUser.status === 200) {
          const user =resultUser.data.user && (resultUser.data.user || null)
         console.log('user',user);
          dispatch({ type: 'LOGIN_COMPLETE', payload: user  })
        } else {
          console.log('resultUser.status',resultUser.status);
          dispatch({ type: 'LOGIN_ERROR'})
          return;
        }        
      } catch (error) {
        client.logout();
        dispatch({ type: 'LOGIN_ERROR', error: loginError(error) });
        return;
      }
    }
    ,[]);// eslint-disable-line react-hooks/exhaustive-deps

  const onRedirectCallback = useCallback(
    async (code, location) => {

      dispatch({ type: 'GET_ACCESS_TOKEN_REQUEST' });
      try {
        let token='';
        const result = await client.getToken(code);
        if (result && result.status === 200) {
          token=result.data.access_token
          //client.token=token
          dispatch({ type: 'GET_ACCESS_TOKEN_COMPLETE', payload: token })
          onRedirectCallbackComplate(location)
        } else {
//          toast.error('Невозмозно получить токен доступа с сервера', { autoClose: 5000 });
          dispatch({ type: 'GET_ACCESS_TOKEN_ERROR'})
          return;
        }
//        onTokenChange()
//         const resultUser = await client.getCurrentUserID();
//         if (resultUser && resultUser.status === 200) {
//           const user =resultUser.data.user && resultUser.data.user || null
//           console.log('user',user);
//           dispatch({ type: 'LOGIN_COMPLETE', payload: user  })
//         } else {
// //          toast.error('Невозмозно получить токен доступа с сервера', { autoClose: 5000 });
//           dispatch({ type: 'LOGIN_ERROR'})
//           return;
//         }        
      } catch (error) {
        dispatch({ type: 'GET_ACCESS_TOKEN_ERROR', error: loginError(error) });
        return;
      }
//      dispatch({ type: 'LOGIN_COMPLETE', payload: 'vv' });
    },
    []);// eslint-disable-line react-hooks/exhaustive-deps

  const contextValue = useMemo(() => {
    return {
      ...state,
      urlLogin: client.urlLogin,
      loginWithRedirect,
      logout,
      onRedirectCallback
    };
  }, [
    state,
    loginWithRedirect,
    logout,
    onRedirectCallback,
    client
  ]);
  return <Auth0Context.Provider value={contextValue}>{children}</Auth0Context.Provider>;
}

export default Auth0Provider;