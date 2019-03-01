import axios from "axios";
import Auth from "../containers/Auth.container";
import { groupBy } from "lodash";

const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
const reportUrl = `${process.env.REACT_APP_BASE_URL}/report`;

export default class ReportApi {
  static getAll = async (page = 0, size = 10) => {
    await Auth.refreshToken();
    const params = { page, size };
    return axios.get(`${reportUrl}`, { params }).then(res => res.data.result);
  };

  static get = async id => {
    await Auth.refreshToken();
    return axios.get(`${reportUrl}/${id}`).then(res => res.data.result);
  };

  static getUserReport = async id => {
    await Auth.refreshToken();
    return axios
      .get(`${reportUrl}/userReport/${id}`)
      .then(res => res.data.result);
  };

  static getDBSources = async () => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/user/getConnList`)
      .then(res => res.data.result)
      .then(data => ({
        "": [],
        ...groupBy(data, "dbType")
      }));
  };

  static update = async report => {
    await Auth.refreshToken();
    return axios
      .put(`${reportUrl}/${report.id}`, report)
      .then(res => res.data.result);
  };

  static create = async report => {
    await Auth.refreshToken();
    return axios.post(`${reportUrl}`, report).then(res => res.data.result);
  };

  static delete = async id => {
    await Auth.refreshToken();
    return axios.delete(`${reportUrl}/${id}`).then(res => res.data.result);
  };

  static reportData = async (
    id,
    filterVOS = [],
    parentParams = [],
    page = 0,
    size = 0
  ) => {
    await Auth.refreshToken();
    const params = { page, size };
    return axios
      .post(`${reportUrl}/${id}/exec`, { filterVOS, parentParams }, { params })
      .then(res => res.data.result);
  };
}
