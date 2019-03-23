import axios from "axios";
import Auth from "../containers/Auth.container";
// import { reports } from "../mockdata";

const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
const reportUrl = `${process.env.REACT_APP_BASE_URL}/report`;

export default class ReportApi {
  static getAll = async (page = 0, size = 10) => {
    await Auth.refreshToken();
    const params = { page, size };
    return axios
      .get(`${reportUrl}/CollaboratorReports`, { params })
      .then(res => res.data.result);
    // TODO: remove next lines
    // .then(res => reports)
    // .catch(err => reports)
  };

  static get = async id => {
    await Auth.refreshToken();
    return axios
      .get(`${reportUrl}/CollaboratorReport/${id}`)
      .then(res => res.data.result);
  };

  static getUserReport = async id => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/userreport/${id}`)
      .then(res => res.data.result);
  };

  static setParams = async (id, params) => {
    await Auth.refreshToken();
    return axios
      .post(`${reportUrl}/${id}/param`, params)
      .then(res => res.data.result);
  };

  static fetchDashboards = async () => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/dashboard`)
      .then(res => res.data.result.data)
      .catch(() => [
        { id: 1, config: '{"layout": []}' },
        { id: 2, config: '{"layout": []}' },
        { id: 3, config: '{"layout": []}' }
      ]);
  };

  static saveLayout = async (dashboardId, layout) => {
    await Auth.refreshToken();
    return axios
      .put(`${baseUrl}/dashboard/${dashboardId}`, { config: layout })
      .then(res => res.data.result.data);
  };

  static removeReport = async reportId => {
    await Auth.refreshToken();
    return axios
      .delete(`${baseUrl}/userreport/${reportId}`)
      .then(res => res.data.result);
  };

  static reportData = async (
    id,
    filterVOS = [],
    parentParams = [],
    page,
    size
  ) => {
    await Auth.refreshToken();
    const params = { page, size };
    return axios
      .post(
        `${baseUrl}/userreport/${id}/exec`,
        { filterVOS, parentParams },
        { params }
      )
      .then(res => res.data.result);
  };
}
