import { Container } from "unstated";
import axios from "axios";
import AuthApi from "../api/auth.api";

const TOKEN = "TOKEN";
const REFRESH = "REFRESH";
const EXPIRES = "EXPIRES";
const USER = "USER";

export class AuthContainer extends Container {
  constructor(props) {
    super(props);

    this.initialize();
  }

  initialize = () => {
    this.token = localStorage.getItem(TOKEN) || "";
    this.refresh = localStorage.getItem(REFRESH) || "";
    this.expires = localStorage.getItem(EXPIRES) || undefined;
    this.user = localStorage.getItem(USER) || "";
    this.hasTokenIssued = false;
    this.token && (axios.defaults.headers.common["token"] = this.token);
  };

  login = ({ token, refresh, expires }) => {
    axios.defaults.headers.common["token"] = token;
    this.token = token;
    this.refresh = refresh;
    this.expires = expires * 1000 + Date.now() - 300;
    this.saveToLS();
  };

  refreshToken = async () => {
    if (Date.now() > this.expires && !this.hasTokenIssued) {
      this.hasTokenIssued = true;
      const refreshToken = await AuthApi.refreshToken(this.token, this.refresh);
      this.hasTokenIssued = false;
      const { token, refreshToken: refresh, timeout: expires } = refreshToken;
      this.login({ token, refresh, expires });
    }
    return Promise.resolve(this.token);
  };

  isLoggedIn = () => {
    this.initialize();
    return !!this.token;
  };

  logout = async () => {
    this.token = this.refresh = this.expires = this.user = "";
    this.saveToLS();
    localStorage.setItem(USER, "");
    await AuthApi.logout();
    axios.defaults.headers.common["token"] = "";
    return Promise.resolve();
  };

  getUserData = async () => {
    const user = await AuthApi.getUser();
    this.user = user.username;
    localStorage.setItem(USER, this.user);
    return this.user;
  };

  saveToLS = () => {
    localStorage.setItem(TOKEN, this.token);
    localStorage.setItem(REFRESH, this.refresh);
    localStorage.setItem(EXPIRES, this.expires);
  };
}

const container = new AuthContainer();

export default container;
