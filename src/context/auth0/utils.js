const normalizeErrorFn = (fallbackMessage) => (
    error
  ) => {
    // if ('error' in error) {
    //   return new OAuthError(error.error, error.error_description);
    // }
    if (error instanceof Error) {
      return error;
    }
    return new Error(fallbackMessage);
  };
  
  export const loginError = normalizeErrorFn('Login failed');