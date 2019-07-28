import { Container } from "unstated";
import Api from "../api/report.api";

export class ReportContainer extends Container {
  state = {
    reports: [],
    userReports: [],
    totalCount: 0
  };

  getAll = async (page, size, query) => {
    const data = await Api.getAll(page, size, query);
    await this.setState({
      reports: page === 0 ? data.data : this.state.reports.concat(data.data),
      totalCount: data.totalSize
    });
    return data;
  };

  get = async reportId => {
    let item = this.state.reports.find(r => r.id === +reportId);
    if (!item) {
      item = await Api.get(reportId);
      const reports = [...this.state.reports, item];
      await this.setState({ reports });
    }
    return item;
  };

  getUserReports = async () => {
    const userReports = await Api.getUserReports();
    await this.setState({ userReports });
    return userReports;
  };

  getUserReport = async instanceId => {
    let item = this.state.userReports.find(r => r.id === +instanceId);
    if (!item) {
      item = await Api.getUserReport(instanceId);
      const userReports = [...this.state.userReports, item];
      await this.setState({ userReports });
    }
    return item;
  };

  getHashCode = async instanceId => {
    const hash = await Api.getHashCode(instanceId);
    return hash;
  };

  createReportInstance = async (
    reportId,
    userReportName,
    params,
    dashboardId
  ) => {
    return Api.createReportInstance(
      reportId,
      userReportName,
      params,
      dashboardId
    );
  };

  getDrilldownInstance = async (reportId, instanceId, params) => {
    return Api.getDrilldownInstance(reportId, instanceId, params);
  };

  removeInstance = async instanceId => {
    await Api.removeInstance(instanceId);
    const userReports = this.state.userReports.filter(
      item => item.id !== +instanceId
    );
    return this.setState({ userReports });
  };

  reportData = async (
    reportId,
    filters,
    params,
    useCache,
    page,
    size,
    orderBy,
    order
  ) => {
    return Api.reportData(
      reportId,
      filters,
      params,
      useCache,
      page,
      size,
      orderBy,
      order
    );
  };

  isDrillDown = instanceId => {
    const temp = this.state.userReports.some(
      ur => +ur.drillDownId === +instanceId
    );
    return temp;
  };

  retrieveState = ({ reports, totalCount }) => {
    this.setState({ reports, totalCount });
  };

  saveAsCSV = async (reportId, filters, params, orderBy, order) => {
    return Api.saveAsCSV(reportId, filters, params, orderBy, order);
  };

  saveAsXlsx = async (reportId, filters, params, orderBy, order) => {
    return Api.saveAsXlsx(reportId, filters, params, orderBy, order);
  };
}

const container = new ReportContainer();

export default container;
