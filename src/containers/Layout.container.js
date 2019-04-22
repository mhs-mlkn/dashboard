import { Container } from "unstated";
import Api from "../api/report.api";

export class LayoutContainer extends Container {
  state = {
    dashboards: []
  };

  fetchDashboards = async () => {
    let dashboards = await Api.fetchDashboards();
    dashboards = dashboards.map(dashboard => {
      dashboard.config = JSON.parse(
        dashboard.config || '{"layout": [], "settings": {}}'
      );
      return dashboard;
    });
    return this.setState({ dashboards });
  };

  addDashboard = async () => {
    const order = this.state.dashboards.length;
    const id = await Api.addDashboard(order);
    const dashboards = [
      ...this.state.dashboards,
      { id, config: { layout: [], settings: {} } }
    ];
    return this.setState({ dashboards });
  };

  getDashboard = index => {
    return this.state.dashboards[index];
  };

  getSettings = (dashboardId, instanceId) => {
    const { config = {} } = this.state.dashboards[dashboardId];
    const { settings = {} } = config;
    return settings[instanceId] || {};
  };

  addToLayout = async (index, instanceId) => {
    const dashboard = this.getDashboard(index);
    const { layout } = dashboard.config;
    const exists = layout.some(l => +l.i === +instanceId);
    if (!exists) {
      const newItem = {
        i: `${instanceId}`,
        x: 0,
        y: Math.max(...layout.map(o => o.y), 0) + 1,
        w: 12,
        h: 12
      };
      layout.push(newItem);
      await this.saveDashboard(index);
    }
    return Promise.resolve(instanceId);
  };

  removeFromLayout = async (index, instanceId) => {
    const dashboard = this.getDashboard(index);
    let { layout = [] } = dashboard.config;
    layout = layout.filter(l => +l.i !== +instanceId);
    Reflect.deleteProperty(dashboard.config.settings || {}, instanceId);
    await this.onLayoutChange(index, layout);
    return this.saveDashboard(index);
  };

  onLayoutChange = async (index, layout) => {
    const dashboard = this.getDashboard(index);
    dashboard.config = { ...dashboard.config, layout };
    const dashboards = this.state.dashboards.map((d, i) =>
      i === +index ? dashboard : d
    );
    return this.setState({ dashboards });
  };

  onSettingsChange = async (index, instanceId, reportSettings) => {
    const dashboard = this.getDashboard(index);
    dashboard.config = {
      ...dashboard.config,
      settings: { ...dashboard.config.settings, [instanceId]: reportSettings }
    };
    const dashboards = this.state.dashboards.map((d, i) =>
      i === +index ? dashboard : d
    );
    return this.setState({ dashboards });
  };

  saveDashboard = async index => {
    const dashboard = this.getDashboard(index);
    const { layout = [], settings = {} } = dashboard.config;
    return Api.saveLayout(dashboard.id, JSON.stringify({ layout, settings }));
  };
}

const container = new LayoutContainer();

export default container;
