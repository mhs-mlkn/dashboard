import axios from "axios";
import Auth from "../containers/Auth.container";

const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
const reportUrl = `${process.env.REACT_APP_BASE_URL}/report`;

export default class ReportApi {
  static getAll = async (page = 0, size = 12) => {
    await Auth.refreshToken();
    const params = { page, size };
    return axios
      .get(`${reportUrl}/CollaboratorReports`, { params })
      .then(res => res.data.result);
  };

  static get = async id => {
    await Auth.refreshToken();
    return axios
      .get(`${reportUrl}/CollaboratorReport/${id}`)
      .then(res => res.data.result);
  };

  static getUserReports = async () => {
    await Auth.refreshToken();
    return axios.get(`${baseUrl}/userreport`).then(res => res.data.result.data);
  };

  static getUserReport = async instanceId => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/userreport/${instanceId}`)
      .then(res => res.data.result);
  };

  static getUserReport = async id => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/userreport/${id}`)
      .then(res => res.data.result);
  };

  static getReportInstance = async (
    reportId,
    userReportName,
    params,
    dashboardId
  ) => {
    await Auth.refreshToken();
    return axios
      .post(
        `${reportUrl}/${reportId}/param?dashboardId=${dashboardId}&name=${userReportName}`,
        params
      )
      .then(res => res.data.result);
  };

  static getDrilldownInstance = async (reportId, instanceId, params) => {
    await Auth.refreshToken();
    return axios
      .post(`${reportUrl}/${reportId}/userreport/${instanceId}/param`, params)
      .then(res => res.data.result);
  };

  static fetchDashboards = async () => {
    await Auth.refreshToken();
    return axios.get(`${baseUrl}/dashboard`).then(res => res.data.result.data);
  };

  static addDashboard = async order => {
    await Auth.refreshToken();
    return axios
      .post(`${baseUrl}/dashboard`, { config: "[]", order })
      .then(res => res.data.result);
  };

  static getDashboardUsers = async () => {
    await Auth.refreshToken();
    return axios.get(`${baseUrl}/dashboard/all`).then(res => res.data.result);
  };

  static saveLayout = async (dashboardId, layout) => {
    await Auth.refreshToken();
    return axios
      .put(`${baseUrl}/dashboard/${dashboardId}`, { config: layout })
      .then(res => res.data.result.data);
  };

  static removeInstance = async instanceId => {
    await Auth.refreshToken();
    return axios
      .delete(`${baseUrl}/userreport/${instanceId}`)
      .then(res => res.data.result);
  };

  static reportData = async (
    id,
    filterVOS = [],
    parentParams = [],
    loadFromCache = true,
    page,
    size
  ) => {
    await Auth.refreshToken();
    const params = { loadFromCache, page, size };
    return axios
      .post(
        `${baseUrl}/userreport/${id}/exec`,
        { filterVOS, parentParams },
        { params }
      )
      .then(res => res.data.result);
  };
}
