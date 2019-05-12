import React, { Component } from "react";
import { withSize } from "react-sizeme";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import Error from "../../components/Error/Error";
import ReportCard from "./ReportCard/ReportCard";
import ShareDashboard from "./ShareDashboard/ShareDashboard";
import LayoutContainer from "../../containers/Layout.container";
import MyCustomEvent from "../../util/customEvent";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

class Dashboard extends Component {
  state = {
    breakpoint: "lg",
    layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
    index: 0,
    error: ""
  };

  componentDidMount = () => {
    const { index } = this.props.match.params;
    MyCustomEvent.on("DELETE_DASHBOARD", this.onDeleteDashboard);
    this.initialize(index);
  };

  componentDidUpdate = async prevProps => {
    const { index: prevIndex } = prevProps.match.params;
    const { index } = this.props.match.params;
    if (prevIndex !== index) {
      this.initialize(index);
    }
  };

  componentWillUnmount = () => {
    MyCustomEvent.on("DELETE_DASHBOARD", this.onDeleteDashboard);
  };

  initialize = index => {
    const dashboardsCount = LayoutContainer.state.dashboards.length;
    if (index === undefined || index >= dashboardsCount) {
      return this.props.history.replace(`/user/dashboard/0`);
    }
    this.setState({ index, layouts: LayoutContainer.getLayouts(index) });
  };

  onDeleteDashboard = async () => {
    const dashboard = LayoutContainer.getDashboard(this.state.index);
    if (dashboard.shared) {
      return alert(
        "داشبورد با شما به اشتراک گذاشته شده است\nنمیتوانید آن را حذف کنید"
      );
    }
    try {
      await LayoutContainer.deleteDashboard(dashboard.id);
    } catch (error) {
      this.setState({ error: "درخواست با خطا مواجه شد" });
    }
  };

  onBreakpointChange = breakpoint => {
    this.setState({ breakpoint });
  };

  render = () => {
    const { width } = this.props.size;
    const { layouts, breakpoint, index, error } = this.state;

    if (error) {
      return <Error message={error} />;
    }

    return (
      <>
        <ResponsiveGridLayout
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 24, md: 18, sm: 12, xs: 8, xxs: 2 }}
          rowHeight={10}
          width={width}
          className="layout"
          onBreakpointChange={this.onBreakpointChange}
          isDraggable={false}
          isResizable={false}
          style={{ direction: "ltr" }}
        >
          {layouts[breakpoint].map(l => {
            return (
              <div key={l.i} style={{ direction: "rtl" }}>
                <ReportCard
                  dashboardIndex={index}
                  layout={l}
                  editEnabled={false}
                />
              </div>
            );
          })}
        </ResponsiveGridLayout>
        <ShareDashboard />
      </>
    );
  };
}

export default withSize()(Dashboard);
