import React from 'react';
import { initialAuthState } from './auth-state';

 /**
 * @ignore
 */
  const stub = () => {
    throw new Error('You forgot to wrap your component in <Auth0Provider>.');
  };

  /**
 * The Auth0 Context
 */
export const initialContext = {
    ...initialAuthState,
    logout: stub,
    handleRedirectCallback: stub,
  };

export default React.createContext(undefined, undefined);