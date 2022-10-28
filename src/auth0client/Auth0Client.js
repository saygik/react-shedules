import { apiCall } from './api';

export default class Auth0Client {

    constructor(options) {
      this.apiBase = options.apiBase;
      this.redirectUri = options.redirectUri;
//      this.atoken =localStorage.getItem('REACT_APPS_USER_TOKEN');
//      console.log('atoken', this.atoken);
    }
    set token(token) {    
      this.atoken = token;
    }
    get token() {    
      return this.atoken;
    }

    async loginWithRedirect(location) {
      const url = `${this.apiBase}/v1/logino?redirect_uri=${this.redirectUri}&state=${location}`;
     window.location['assign'](url);
    }
    async getToken(code) {
      const authResult = await apiCall({
        url:`${this.apiBase}/v1/token?code=${code}&redirect_uri=${this.redirectUri}`,
        method: 'get',
        token: ''
      })
      return authResult
    }
    async logout() {
      const authResult = await apiCall({
        url:`${this.apiBase}/v1/logout`,
        method: 'get',
        token: this.atoken
      })
      return authResult
    }


    async getCurrentUserID() {
      const authResult = await apiCall({
        url:`${this.apiBase}/v1/loginuser`,
        method: 'get',
        token: this.atoken
      })
//      console.log('authResult',authResult);
      return authResult
    }

}