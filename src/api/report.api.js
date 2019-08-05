import axios from "axios";
import Auth from "../containers/Auth.container";

const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
const reportUrl = `${process.env.REACT_APP_BASE_URL}/report`;

export default class ReportApi {
  static getAll = async (page = 0, size = 12, query = "") => {
    const params = { page, size, name: query };
    return axios
      .get(`${reportUrl}/CollaboratorReports`, { params })
      .then(res => res.data.result);
  };

  static get = async id => {
    return axios
      .get(`${reportUrl}/CollaboratorReport/${id}`)
      .then(res => res.data.result);
  };

  static getUserReports = async () => {
    return axios.get(`${baseUrl}/userreport`).then(res => res.data.result.data);
  };

  static getUserReport = async instanceId => {
    return axios
      .get(`${baseUrl}/userreport/${instanceId}`)
      .then(res => res.data.result);
  };

  static getUserReport = async id => {
    return axios
      .get(`${baseUrl}/userreport/${id}`)
      .then(res => res.data.result)
      .catch(err => {
        throw new Error(err.response.data.message || "درخواست با خطا مواجه شد");
      });
  };

  static getHashCode = async instanceId => {
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
    return axios
      .post(`${reportUrl}/${reportId}/userreport/${instanceId}/param`, params)
      .then(res => res.data.result);
  };

  static fetchDashboards = async () => {
    return axios
      .get(`${baseUrl}/dashboard/all`)
      .then(res => res.data.result.data);
  };

  static addDashboard = async (order, name) => {
    return axios
      .post(`${baseUrl}/dashboard`, { config: "", order, name })
      .then(res => res.data.result);
  };

  static getDashboardUsers = async dashboardId => {
    return axios
      .get(`${baseUrl}/dashboard/${dashboardId}/users`)
      .then(res => res.data.result.data);
  };

  static addDashboardUser = async (dashboardId, params) => {
    return axios
      .get(`${baseUrl}/dashboard/${dashboardId}/share`, { params })
      .then(res => res.data.result)
      .catch(err => {
        throw new Error(err.response.data.message || "درخواست با خطا مواجه شد");
      });
  };

  static deleteDashboardUser = async sharedId => {
    return axios
      .delete(`${baseUrl}/dashboard/shared/${sharedId}`)
      .then(res => res.data.result.data);
  };

  static getReportUsers = async reportId => {
    return axios
      .get(`${reportUrl}/${reportId}/users`)
      .then(res => res.data.result.data);
  };

  static addReportUser = async (reportId, identity) => {
    return axios
      .get(`${reportUrl}/${reportId}/addUser?identity=${identity}`)
      .then(res => res.data.result)
      .catch(err => {
        throw new Error(err.response.data.message || "درخواست با خطا مواجه شد");
      });
  };

  static removeReportUser = async (reportId, userId) => {
    return axios
      .get(`${reportUrl}/${reportId}/removeUser?id=${userId}`)
      .then(res => res.data.result.userVOList);
  };

  static saveDashboard = async ({ id, config }) => {
    return axios
      .put(`${baseUrl}/dashboard/${id}`, { config: JSON.stringify(config) })
      .then(res => res.data.result.data);
  };

  static deleteDashboard = async id => {
    return axios
      .delete(`${baseUrl}/dashboard/${id}`)
      .then(res => res.data.result.data);
  };

  static removeInstance = async instanceId => {
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

  static saveAsCSV = async (
    id,
    filterVOS = [],
    parentParams = [],
    orderBy,
    order
  ) => {
    return axios
      .post(`${baseUrl}/userreport/${id}/getCSV`, {
        filterVOS,
        parentParams,
        orderByElementVOS: orderBy
          ? [{ name: orderBy, isDesc: order === "desc" }]
          : []
      })
      .then(res => {
        // var disposition = request.getResponseHeader('content-disposition');
        // var matches = /"([^"]*)"/.exec(disposition);
        // var filename = (matches != null && matches[1] ? matches[1] : 'file.pdf');
        return res.data;
      });
  };

  static saveAsXlsx = async (
    id,
    filterVOS = [],
    parentParams = [],
    orderBy,
    order
  ) => {
    const url = `${baseUrl}/userreport/${id}/getXLS`;
    const data = {
      filterVOS,
      parentParams,
      orderByElementVOS: orderBy
        ? [{ name: orderBy, isDesc: order === "desc" }]
        : []
    };

    // return axios
    //   .post(
    //     `${baseUrl}/userreport/${id}/getXLS`,
    //     {
    //       filterVOS,
    //       parentParams,
    //       orderByElementVOS: orderBy
    //         ? [{ name: orderBy, isDesc: order === "desc" }]
    //         : []
    //     },
    //     {
    //       headers: {
    //         responseType: "blob"
    //       }
    //     }
    //   )
    //   .then(res => {
    //     const url = window.URL.createObjectURL(new Blob([res.data]));
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", `report-${id}.xlsx`);
    //     document.body.appendChild(link);
    //     link.click();
    //   });
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        token: localStorage.getItem("DASH_USER_TOKEN"),
        "Content-Type": "application/json"
      })
    }).then(res => res.blob());
  };
}
