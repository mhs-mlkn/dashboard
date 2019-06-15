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
      .then(res => res.data.result)
      .catch(err => {
        throw new Error(err.response.data.message || "درخواست با خطا مواجه شد");
      });
  };

  static getHashCode = async instanceId => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/userreport/${instanceId}/hash`)
      .then(res => res.data.result);
  };

  static createReportInstance = async (
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
      .then(res => res.data.result)
      .catch(err => {
        throw new Error(err.response.data.message || "درخواست با خطا مواجه شد");
      });
  };

  static getDrilldownInstance = async (reportId, instanceId, params) => {
    await Auth.refreshToken();
    return axios
      .post(`${reportUrl}/${reportId}/userreport/${instanceId}/param`, params)
      .then(res => res.data.result);
  };

  static fetchDashboards = async () => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/dashboard/all`)
      .then(res => res.data.result.data);
  };

  static addDashboard = async (order, name) => {
    await Auth.refreshToken();
    return axios
      .post(`${baseUrl}/dashboard`, { config: "", order, name })
      .then(res => res.data.result);
  };

  static getDashboardUsers = async dashboardId => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/dashboard/${dashboardId}/users`)
      .then(res => res.data.result.data);
  };

  static addDashboardUser = async (dashboardId, params) => {
    await Auth.refreshToken();
    return axios
      .get(`${baseUrl}/dashboard/${dashboardId}/share`, { params })
      .then(res => res.data.result)
      .catch(err => {
        throw new Error(err.response.data.message || "درخواست با خطا مواجه شد");
      });
  };

  static deleteDashboardUser = async sharedId => {
    await Auth.refreshToken();
    return axios
      .delete(`${baseUrl}/dashboard/shared/${sharedId}`)
      .then(res => res.data.result.data);
  };

  static getReportUsers = async reportId => {
    await Auth.refreshToken();
    return axios
      .get(`${reportUrl}/${reportId}/users`)
      .then(res => res.data.result.data);
  };

  static addReportUser = async (reportId, identity) => {
    await Auth.refreshToken();
    return axios
      .get(`${reportUrl}/${reportId}/addUser?identity=${identity}`)
      .then(res => res.data.result)
      .catch(err => {
        throw new Error(err.response.data.message || "درخواست با خطا مواجه شد");
      });
  };

  static removeReportUser = async (reportId, userId) => {
    await Auth.refreshToken();
    return axios
      .get(`${reportUrl}/${reportId}/removeUser?id=${userId}`)
      .then(res => res.data.result.userVOList);
  };

  static saveDashboard = async ({ id, config }) => {
    await Auth.refreshToken();
    return axios
      .put(`${baseUrl}/dashboard/${id}`, { config: JSON.stringify(config) })
      .then(res => res.data.result.data);
  };

  static deleteDashboard = async id => {
    await Auth.refreshToken();
    return axios
      .delete(`${baseUrl}/dashboard/${id}`)
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
    size,
    orderBy,
    order
  ) => {
    await Auth.refreshToken();
    const params = { loadFromCache, page, size };
    return axios
      .post(
        `${baseUrl}/userreport/${id}/exec`,
        {
          filterVOS,
          parentParams,
          orderByElementVOS: orderBy
            ? [{ name: orderBy, isDesc: order === "desc" }]
            : []
        },
        { params }
      )
      .then(res => res.data.result);
  };
}
