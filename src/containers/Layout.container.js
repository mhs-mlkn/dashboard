import { Container } from "unstated";
import Api from "../api/report.api";

const DEFAULT_CONFIG_STRING =
  '{"layouts": {"lg": [], "md": [], "sm": [], "xs": [], "xxs": []}, "settings": {}}';

const MIN_W = { lg: 4, md: 6, sm: 5, xs: 4, xxs: 2 };
const MIN_H = { lg: 7, md: 7, sm: 5, xs: 5, xxs: 5 };

export class LayoutContainer extends Container {
  state = {
    dashboards: []
  };

  fetchDashboards = async () => {
    let dashboards = await Api.fetchDashboards();
    dashboards = dashboards.map(dashboard => {
      dashboard.config = JSON.parse(dashboard.config || DEFAULT_CONFIG_STRING);
      dashboard.config.layouts = setMinSize(dashboard.config.layouts);
      return dashboard;
    });
    return this.setState({ dashboards });
  };

  addDashboard = async () => {
    const order = this.state.dashboards.length;
    const id = await Api.addDashboard(order);
    const config = JSON.parse(DEFAULT_CONFIG_STRING);
    config.layouts = setMinSize(config.layouts);
    let dashboards = [...this.state.dashboards, { id, config }];
    dashboards = [
      ...dashboards.filter(d => !d.shared),
      ...dashboards.filter(d => d.shared)
    ];
    return this.setState({ dashboards });
  };

  deleteDashboard = async id => {
    await Api.deleteDashboard(id);
    const dashboards = this.state.dashboards.filter(d => d.id !== id);
    return this.setState({ dashboards });
  };

  getDashboard = dashboardIndex => {
    return this.state.dashboards[dashboardIndex];
  };

  getLayouts = dashboardIndex => {
    const dashboard = this.getDashboard(dashboardIndex);
    return dashboard.config.layouts;
  };

  getSettings = (dashboardIndex, instanceId) => {
    const { config = {} } = this.getDashboard(dashboardIndex);
    const { settings = {} } = config;
    return settings[instanceId] || {};
  };

  addToLayout = async (dashboardIndex, instanceId) => {
    const dashboard = this.getDashboard(dashboardIndex);
    dashboard.config.layouts = pushItem(
      dashboard.config.layouts,
      `${instanceId}`
    );
    await this.saveDashboard(dashboardIndex);
    return Promise.resolve(instanceId);
  };

  removeFromLayout = async (dashboardIndex, instanceId) => {
    const dashboard = this.getDashboard(dashboardIndex);
    let { layouts } = dashboard.config;
    layouts = removeItem(layouts, `${instanceId}`);
    Reflect.deleteProperty(dashboard.config.settings || {}, instanceId);
    await this.setLayouts(dashboardIndex, layouts);
    return this.saveDashboard(dashboardIndex);
  };

  setLayouts = async (dashboardIndex, layouts) => {
    const dashboard = this.getDashboard(dashboardIndex);
    const updatedDashboard = {
      ...dashboard,
      config: { ...dashboard.config, layouts }
    };
    const dashboards = this.state.dashboards.map((d, i) =>
      i === +dashboardIndex ? updatedDashboard : d
    );
    return this.setState({ dashboards });
  };

  onSettingsChange = async (dashboardIndex, instanceId, reportSettings) => {
    const dashboard = this.getDashboard(dashboardIndex);
    const updatedDashboard = {
      ...dashboard,
      config: {
        ...dashboard.config,
        settings: { ...dashboard.config.settings, [instanceId]: reportSettings }
      }
    };
    const dashboards = this.state.dashboards.map((d, i) =>
      i === +dashboardIndex ? updatedDashboard : d
    );
    return this.setState({ dashboards });
  };

  saveDashboard = async dashboardIndex => {
    const dashboard = this.getDashboard(dashboardIndex);
    return Api.saveDashboard(dashboard);
  };
}

function setMinSize(layouts) {
  const _layouts = {};
  for (const br in layouts) {
    if (layouts.hasOwnProperty(br)) {
      let layout = layouts[br];
      layout = layout.map(l => ({ ...l, minW: MIN_W[br], minH: MIN_H[br] }));
      _layouts[br] = layout;
    }
  }
  return _layouts;
}

function pushItem(layouts, instanceId) {
  const _layouts = {};
  for (const br in layouts) {
    if (layouts.hasOwnProperty(br)) {
      let layout = layouts[br];
      const item = {
        i: instanceId,
        x: 0,
        y: _getMaxY(layout),
        w: MIN_W[br],
        h: MIN_H[br],
        minW: MIN_W[br],
        minH: MIN_H[br]
      };
      layout = [...layout, item];
      _layouts[br] = layout;
    }
  }
  return _layouts;
}

function removeItem(layouts, instanceId) {
  const _layouts = {};
  for (const br in layouts) {
    if (layouts.hasOwnProperty(br)) {
      let layout = layouts[br];
      layout = layout.filter(l => l.i !== instanceId);
      _layouts[br] = layout;
    }
  }
  return _layouts;
}

function _getMaxY(layout) {
  if (layout.length === 0) {
    return 0;
  }
  let item = layout.reduce((max, i) => (i.y > max.y ? i : max), layout[0]);
  return item.y + item.h + 1;
}

const container = new LayoutContainer();

export default container;
