import React, { Component } from "react";
import { Subscribe } from "unstated";
import { withSize } from "react-sizeme";
import ReactGridLayout from "react-grid-layout";
import Error from "../../components/Error/Error";
import ReportCard from "./ReportCard/ReportCard";
import ShareDashboard from "./ShareDashboard/ShareDashboard";
import LayoutContainer from "../../containers/Layout.container";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

class Dashboard extends Component {
  state = {
    index: 0,
    error: ""
  };

  componentDidMount = () => {
    const { index } = this.props.match.params;
    this.setIndex(index);
  };

  componentDidUpdate = async prevProps => {
    const { index: prevIndex } = prevProps.match.params;
    const { index } = this.props.match.params;
    if (prevIndex !== index) {
      this.setIndex(index);
    }
  };

  setIndex = index => {
    const dashboardsCount = LayoutContainer.state.dashboards.length;
    if (index === undefined || index >= dashboardsCount) {
      return this.props.history.replace(`/user/dashboard/0`);
    }
    this.setState({ index });
  };

  render = () => {
    const { width } = this.props.size;
    const { index, error } = this.state;

    if (error) {
      return <Error message={error} />;
    }

    return (
      <Subscribe to={[LayoutContainer]}>
        {Layout => {
          const dashboard = Layout.getDashboard(index);
          const { layout = [] } = dashboard.config;
          return (
            <>
              <ShareDashboard />
              <ReactGridLayout
                width={width}
                className="layout"
                cols={24}
                rowHeight={10}
                layout={layout}
                style={{ direction: "ltr" }}
              >
                {layout.map(l => {
                  l.static = true;
                  return (
                    <div key={l.i} data-grid={l} style={{ direction: "rtl" }}>
                      <ReportCard layout={l} editEnabled={false} />
                    </div>
                  );
                })}
              </ReactGridLayout>
            </>
          );
        }}
      </Subscribe>
    );
  };
}

export default withSize()(Dashboard);
