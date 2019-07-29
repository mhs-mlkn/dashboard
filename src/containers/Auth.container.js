import { Container } from "unstated";
import { createHash, randomBytes } from "crypto";
import Axios from "axios";
import AuthApi from "../api/auth.api";

const TOKEN = "DASH_USER_TOKEN";
const VERIFIER = "DASH_USER_VERIFIER";
const REFRESH = "DASH_USER_REFRESH";
const EXPIRES = "DASH_USER_EXPIRES";
const USER = "DASH_USER_USER";
const TIMEOUT = "DASH_USER_TIMEOUT";

let intervalId = 0;

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer) {
  return createHash("sha256")
    .update(buffer)
    .digest();
}

function getValue(key) {
  let val = localStorage.getItem(key);
  val = val === "undefined" ? "" : val;
  val = val === "NaN" ? 0 : val;
  return val;
}

export class AuthContainer extends Container {
  constructor(props) {
    super(props);

    this.initialize();

    if (!!this.timeout) {
      this.setRefreshTokenInterval(this.timeout);
    }
  }

  initialize = () => {
    this.token = getValue(TOKEN);
    this.verifier = getValue(VERIFIER);
    this.refresh = getValue(REFRESH);
    this.expires = getValue(EXPIRES);
    this.timeout = getValue(TIMEOUT);
    this.user = getValue(USER);

    this.hasTokenIssued = false;
    this.token && (Axios.defaults.headers.common["token"] = this.token);
  };

  setRefreshTokenInterval = timeout => {
    if (intervalId !== 0) {
      intervalId = 0;
      clearInterval(intervalId);
    }

    intervalId = setInterval(async () => {
      this.hasTokenIssued = true;
      const refreshToken = await AuthApi.refreshToken(
        this.refresh,
        this.verifier
      );
      this.hasTokenIssued = false;
      this.login(refreshToken);
    }, timeout * 1000);
  };

  generateVerifier = () => {
    this.verifier = base64URLEncode(randomBytes(32));
    this.saveToLS();
    return this.verifier;
  };

  getChallenegeCode = () => {
    return base64URLEncode(sha256(this.verifier));
  };

  checkToken = async code => {
    return AuthApi.getToken(code, this.verifier).then(result => {
      if (result.access_token) {
        return this.login(result);
      } else {
        return Promise.reject("NO ACCESS_TOKEN");
      }
    });
  };

  login = ({ access_token, refresh_token, expires_in }) => {
    Axios.defaults.headers.common["token"] = access_token;
    this.token = access_token;
    this.refresh = refresh_token;
    this.expires = expires_in * 1000 + Date.now() - 5000;
    this.timeout = 10; //expires_in - 5;
    this.setRefreshTokenInterval(this.timeout);
    this.saveToLS();
  };

  refreshToken = async () => {
    if (Date.now() > this.expires && !this.hasTokenIssued) {
      this.hasTokenIssued = true;
      const refreshToken = await AuthApi.refreshToken(
        this.refresh,
        this.verifier
      );
      this.hasTokenIssued = false;
      this.login(refreshToken);
    }
    return Promise.resolve(this.token);
  };

  isLoggedIn = () => {
    this.token = localStorage.getItem(TOKEN) || "";
    return !!this.token;
  };

  logout = async () => {
    clearInterval(intervalId);
    intervalId = 0;
    const URL = process.env.REACT_APP_POD_SSO_LOGOUT;
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CONTINUE = process.env.REACT_APP_REDIRECT_URI;
    this.token = this.verifier = this.refresh = this.expires = this.timeout = this.user =
      "";
    localStorage.clear();
    Axios.defaults.headers.common["token"] = "";
    window.location.href = `${URL}?client_id=${CLIENT_ID}&continue=${CONTINUE}`;
    return Promise.resolve();
  };

  fetchUser = async () => {
    const user = await AuthApi.getUser(this.token);
    this.user = user.preferred_username;
    localStorage.setItem(USER, this.user);
    return this.user;
  };

  getUsername = () => {
    this.user = localStorage.getItem(USER);
    if (!this.user || this.user === "undefined") {
      this.fetchUser();
    }
    return this.user || "";
  };

  saveToLS = () => {
    localStorage.setItem(TOKEN, this.token);
    localStorage.setItem(VERIFIER, this.verifier);
    localStorage.setItem(REFRESH, this.refresh);
    localStorage.setItem(EXPIRES, this.expires);
    localStorage.setItem(TIMEOUT, this.timeout);
  };
}

const container = new AuthContainer();

export default container;
