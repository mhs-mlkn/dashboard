import { Container } from "unstated";
import Api from "../api/report.api";
import { pick } from "lodash";

export class ReportContainer extends Container {
  state = {
    totalCount: 0,
    reports: [],
    dashboards: []
  };

  getAll = async (page, size) => {
    const data = await Api.getAll(page, size);
    await this.setState({
      reports: data.data,
      totalCount: data.totalSize
    });
    return data;
  };

  get = async id => {
    let item = this.state.reports.find(r => r.id === id);
    if (!item) {
      item = await Api.get(id);
    }
    return item;
  };

  setParams = async (id, params) => {
    return Api.setParams(id, params);
  };

  fetchDashboards = async () => {
    const dashboards = await Api.fetchDashboards();
    return this.setState({ dashboards });
  };

  getDashboard = index => {
    return this.state.dashboards[index];
  };

  addLayout = async (instanceId, reportId) => {
    const exists = this.state.layout.some(l => +l.i === +instanceId);
    if (!exists) {
      const newItem = {
        i: `${instanceId}`,
        x: 0,
        y: Math.max(...this.state.layout.map(o => o.y), 0) + 1,
        w: 12,
        h: 12,
        static: true
      };
      const layout = [...this.state.layout, newItem];
      const reportMap = { ...this.state.reportMap, [instanceId]: reportId };
      await this.setState({ layout, reportMap });
      await this.saveLayout();
    }
    return Promise.resolve(instanceId);
  };

  removeFromLayout = async reportId => {
    const layout = this.state.layout.filter(l => +l.i !== +reportId);
    const reportMap = pick(
      this.state.reportMap,
      Object.keys(this.state.reportMap).filter(key => +key !== +reportId)
    );
    return this.setState({ layout, reportMap });
  };

  removeReport = async reportId => {
    return Api.removeReport(reportId);
  };

  setLayout = async layout => {
    return this.setState({ layout });
  };

  saveLayout = async () => {
    const { layout, reportMap } = this.state;
    return Api.saveLayout(
      this.dashboards[0].id,
      JSON.stringify({ layout, reportMap })
    );
  };

  setEditLayout = async editEnabled => {
    const layout = this.state.layout.map(l => ({
      ...l,
      static: !editEnabled
    }));
    return this.setState({ layout });
  };

  reportData = async (reportId, filters, params, page, size) => {
    return Api.reportData(reportId, filters, params, page, size);
  };
}

const container = new ReportContainer();

export default container;
