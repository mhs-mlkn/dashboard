import { Container } from "unstated";
import Api from "../api/report.api";

export class LayoutContainer extends Container {
  state = {
    dashboards: [],
    isDirty: false
  };

  fetchDashboards = async () => {
    let dashboards = await Api.fetchDashboards();
    dashboards = dashboards.map(dashboard => {
      dashboard.config = JSON.parse(
        dashboard.config || '{"layout": [], "settings": {}}'
      );
      dashboard.config.layout = dashboard.config.layout.map(l => {
        l.minW = 4;
        l.minH = 7;
        return l;
      });
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
        y: this._getMaxY(index),
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
    const updatedDashboard = {
      ...dashboard,
      config: { ...dashboard.config, layout }
    };
    dashboard.config = { ...dashboard.config, layout };
    const dashboards = this.state.dashboards.map((d, i) =>
      i === +index ? updatedDashboard : d
    );
    return this.setState({ dashboards, isDirty: true });
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
    return this.setState({ dashboards, isDirty: true });
  };

  saveDashboard = async index => {
    const dashboard = this.getDashboard(index);
    const { layout = [], settings = {} } = dashboard.config;
    await Api.saveLayout(dashboard.id, JSON.stringify({ layout, settings }));
    return this.setState({ isDirty: false });
  };

  _getMaxY = index => {
    const layout = this.getDashboard(index).config.layout;
    if (layout.length === 0) {
      return 0;
    }
    let item = layout.reduce((max, i) => (i.y > max.y ? i : max), layout[0]);
    return item.y + item.h + 1;
  };
}

const container = new LayoutContainer();

export default container;
