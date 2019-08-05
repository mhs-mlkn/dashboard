import { Container } from "unstated";
import { createHash, randomBytes } from "crypto";
import Axios from "axios";
import { get } from "lodash";
import AuthApi from "../api/auth.api";

const ACCESS_TOKEN = "DASH_USER_ACCESS_TOKEN";
const TOKEN_VERIFIER = "DASH_USER_TOKEN_VERIFIER";
const REFRESH_TOKEN = "DASH_USER_REFRESH_TOKEN";
const USER = "DASH_USER_USER";

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

function getLSValue(key) {
  let val = localStorage.getItem(key);
  return ["undefined", "null", "NaN"].indexOf(val) > -1 ? "" : val;
}

class AuthContainer extends Container {
  state = {
    username: ""
  };

  constructor(props) {
    super(props);

    this.setState({ username: getLSValue(USER) });
    this.subscribers = [];
    this.configAxios();
  }

  generateVerifier = () => {
    const verifier = base64URLEncode(randomBytes(32));
    localStorage.setItem(TOKEN_VERIFIER, verifier);
    return verifier;
  };

  getChallenegeCode = token_verifier => {
    return base64URLEncode(sha256(token_verifier));
  };

  getToken = async code => {
    let token_verifier = getLSValue(TOKEN_VERIFIER);
    return AuthApi.getToken(code, token_verifier).then(res => {
      if (!!res.access_token && !!res.refresh_token) {
        this.saveToLS(res);
        return res;
      } else {
        return Promise.reject("INVALID LOGIN");
      }
    });
  };

  refreshToken = async () => {
    const refresh_token = getLSValue(REFRESH_TOKEN);
    const token_verifier = getLSValue(TOKEN_VERIFIER);
    const result = await AuthApi.refreshToken(refresh_token, token_verifier);
    this.saveToLS(result);
    return result;
  };

  isLoggedIn = () => {
    const access_token = getLSValue(ACCESS_TOKEN);
    return !!access_token;
  };

  logout = () => {
    const URL = process.env.REACT_APP_POD_SSO_LOGOUT;
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CONTINUE = process.env.REACT_APP_REDIRECT_URI;
    localStorage.clear();
    window.location.href = `${URL}?client_id=${CLIENT_ID}&continue=${CONTINUE}`;
  };

  fetchUser = async () => {
    const access_token = getLSValue(ACCESS_TOKEN);
    const user = await AuthApi.getUser(access_token);
    const username = user.preferred_username;
    localStorage.setItem(USER, username);
    await this.setState({ username });
    return username;
  };

  getUsername = async () => {
    const username = this.state.username || getLSValue(USER);
    if (!username) {
      return this.fetchUser();
    }
    return username;
  };

  saveToLS = ({ access_token, refresh_token }) => {
    localStorage.setItem(ACCESS_TOKEN, access_token);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
  };

  configAxios = () => {
    Axios.interceptors.request.use(config => {
      config.headers.token = getLSValue(ACCESS_TOKEN);
      return config;
    });

    Axios.interceptors.response.use(
      response => response,
      error => {
        if (get(error, "response.status", 400) === 401) {
          return this.refreshTokenAndRetry(error);
        }
        return Promise.reject(error);
      }
    );
  };

  refreshTokenAndRetry = async error => {
    const onAccessTokenFetched = () => {
      this.subscribers.forEach(callback => callback());
      this.subscribers = [];
    };

    const addSubscriber = callback => {
      this.subscribers.push(callback);
    };

    try {
      const { response: errorResponse } = error;

      const retryOriginalRequest = new Promise(resolve => {
        addSubscriber(() => resolve(Axios(errorResponse.config)));
      });

      if (!this.isRefreshTokenInIssued) {
        this.isRefreshTokenInIssued = true;
        await this.refreshToken();
        this.isRefreshTokenInIssued = false;
        onAccessTokenFetched();
      }

      return retryOriginalRequest;
    } catch (error) {
      Promise.reject(error);
    }
  };
}

const container = new AuthContainer();

export default container;
