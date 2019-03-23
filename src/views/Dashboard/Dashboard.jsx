import React, { Component } from "react";
import { withSize } from "react-sizeme";
import ReactGridLayout from "react-grid-layout";
import ReportContainer from "../../containers/Report.container";
import ReportCard from "./ReportCard/ReportCard";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

class Dashboard extends Component {
  state = {
    layout: [],
    error: ""
  };

  componentDidMount = () => {
    const { index } = this.props.match.params;
    const dashboardsCount = ReportContainer.state.dashboards.length;
    if (index === undefined || index >= dashboardsCount) {
      return this.props.history.replace(`/user/dashboard/0`);
    }
    this.getConfig(index);
  };

  getConfig = index => {
    const dashboard = ReportContainer.getDashboard(index);
    try {
      const config = JSON.parse(dashboard.config);
      const layout = config.layout;
      this.setState({ layout });
    } catch (error) {
      this.setState({ error: "تنظیمات کاربر نامعتبر است" });
    }
  };

  render = () => {
    const { width } = this.props.size;
    const { layout, error } = this.state;

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <ReactGridLayout
        width={width}
        className="layout"
        cols={24}
        rowHeight={10}
        layout={layout}
        style={{ direction: "ltr" }}
      >
        {layout.map(layout => {
          return (
            <div key={layout.i} data-grid={layout} style={{ direction: "rtl" }}>
              <ReportCard layout={layout} editEnabled={false} />
            </div>
          );
        })}
      </ReactGridLayout>
    );
  };
}

export default withSize()(Dashboard);
