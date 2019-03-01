import axios from "axios";

const baseUrl = `${process.env.REACT_APP_BASE_URL}/auth`;

export default class AuthApi {
  static refreshToken = async (token, refresh) => {
    return axios
      .get(`${baseUrl}/refresh`, {
        params: { token, refresh }
      })
      .then(res => res.data)
      .then(data => data.result);
  };

  static getUser = async () => {
    const url = `${baseUrl}/userInfo`;
    return axios.get(url).then(res => res.data.result);
  };

  static logout = async () => {
    return axios.get(`${baseUrl}/logout`).then(res => res.data);
  };
}
