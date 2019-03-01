import { Container } from "unstated";
import Api from "../api/report.api";

export class ReportContainer extends Container {
  state = {
    totalCount: 0,
    reports: [],
    dbTypes: [],
    dbSources: { "": [] }
  };

  getAll = async (page, size) => {
    const data = await Api.getAll(page, size);
    await this.setState({ reports: data.data, totalCount: data.totalSize });
    return data;
  };

  get = async id => {
    let item = this.state.reports.find(r => r.id === id);
    if (!item) {
      item = await Api.get(id);
    }
    return item;
  };

  getDBSources = async () => {
    const dbSources = await Api.getDBSources();
    const dbTypes = Object.keys(dbSources);
    return this.setState({ dbTypes, dbSources });
  };

  save = async values => {
    const {
      id,
      name,
      type,
      chartType,
      source,
      dataSource,
      drillDownId,
      query,
      params: queryParams,
      filters: queryFilters,
      description
    } = values;

    const report = {
      id,
      name,
      type,
      chartType,
      source,
      drillDownId: drillDownId || -1,
      description,
      query: { query, dataSource, queryParams, queryFilters }
    };

    if (id > 0) {
      await Api.update(report);
      const reports = this.state.reports.map(r => {
        if (report.id === r.id) {
          return {
            ...r,
            ...report
          };
        }
        return r;
      });
      return this.setState({ reports });
    }
    const newReportId = await Api.create(report);
    const newReport = await this.get(newReportId);
    const reports = [newReport, ...this.state.reports];
    return this.setState({ reports });
  };

  delete = async id => {
    await Api.delete(id);
    const reports = this.state.reports.filter(r => r.id !== id);
    return this.setState({ reports, totalCount: this.state.totalCount - 1 });
  };
}

const container = new ReportContainer();

export default container;
