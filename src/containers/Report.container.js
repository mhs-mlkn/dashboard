import { Container } from "unstated";
import Api from "../api/report.api";

export class ReportContainer extends Container {
  state = {
    reports: [],
    totalCount: 0
  };

  getAll = async (page, size) => {
    const data = await Api.getAll(page, size);
    await this.setState({
      reports: data.data,
      totalCount: data.totalSize
    });
    return data;
  };

  get = async instanceId => {
    //TODO: refactor this method to write report by instanceId
    let item = this.state.reports.find(r => r.id === instanceId);
    if (!item) {
      item = await Api.get(instanceId);
    }
    return item;
  };

  getReportInstance = async (reportId, params) => {
    return Api.getReportInstance(reportId, params);
  };

  removeInstance = async instanceId => {
    return Api.removeInstance(instanceId);
  };

  reportData = async (reportId, filters, params, page, size) => {
    return Api.reportData(reportId, filters, params, page, size);
  };
}

const container = new ReportContainer();

export default container;
