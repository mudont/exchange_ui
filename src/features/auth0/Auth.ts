// @ts-nocheck
import auth0, { Auth0DecodedHash, Auth0ParseHashError } from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

type RouteCb = () => void;
export default class Auth {
  /** @type {any} */
  accessToken: string|null = "";
  /** @type {any} */
  idToken: string|null = "";
  /** @type {any} */
  expiresAt: any = null;
  goHome: RouteCb = () => {};

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid'
  });
  constructor(goHome: RouteCb) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);

    this.goHome = goHome.bind(this);
    this.accessToken = localStorage.getItem('accessToken')
    this.idToken = localStorage.getItem('idToken')
    if (this.accessToken) {
      this.expiresAt = parseFloat(localStorage.getItem('expiresAt') || "0")
    }
    if (this.isAuthenticated()) {
      localStorage.setItem('isLoggedIn', 'true')
    }
  }

  login() {
    this.auth0.authorize();
  }

  // This will be called from the auth callback after login completed
  handleAuthentication() {
    this.auth0.parseHash((err: Auth0ParseHashError | null, authResult: Auth0DecodedHash | null) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log(`Auth success. ${JSON.stringify(authResult)}`)
        this.setSession(authResult);
      } else if (err) {
        this.goHome();
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  /**
   * @param {auth0.Auth0DecodedHash} authResult
   */
  setSession(authResult: Auth0DecodedHash) {
    // Set the time that the access token will expire at
    let expiresAt = ((authResult.expiresIn || 0) * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken || "";
    this.idToken = authResult.idToken || "";
    this.expiresAt = expiresAt;

    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('accessToken', this.accessToken)
    localStorage.setItem('idToken', this.idToken )
    localStorage.setItem('expiresAt', this.expiresAt)
    // navigate to the home route
    this.goHome();
  }

  renewSession() {
    if (this.isAuthenticated()) {
      return
    }
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // navigate to the home route
    this.goHome();
  }

  isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = this.expiresAt;
    const margin = 60 * 1000; // one minute
    const loggedIn = new Date().getTime() < (expiresAt - margin);
    return loggedIn;
  }
}
