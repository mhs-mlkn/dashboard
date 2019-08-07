import React, { Component } from "react";
import { Subscribe } from "unstated";
import { withSnackbar } from "notistack";
import { withSize } from "react-sizeme";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import Error from "../../components/Error/Error";
import ReportCard from "./ReportCard/ReportCard";
import ShareDashboard from "./ShareDashboard/ShareDashboard";
import LayoutContainer from "../../containers/Layout.container";
import TimerContainer from "../../containers/Timer.container";
import DeleteDashboardContainer from "../../containers/DeleteDashboard.container";
import MyCustomEvent from "../../util/customEvent";
import { CHANGE_DASHBOARD_INTERVAL } from "../../constants";
import { get } from "lodash";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

class Dashboard extends Component {
  state = {
    noDashboards: true,
    breakpoint: "lg",
    layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
    dashboardId: undefined,
    error: ""
  };

  componentDidCatch(error, info) {
    console.dir(info);
    this.setState({ error: "خطای ارتباط با پایگاه داده" });
  }

  componentDidMount = () => {
    const { dashboardId } = this.props.match.params;
    this.initialize(dashboardId);
    MyCustomEvent.on("DELETE_DASHBOARD", this.onDeleteDashboard);
    this.toggleInterval();
  };

  componentDidUpdate = async prevProps => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.componentWillUnmount();
      this.componentDidMount();
    }
  };

  componentWillUnmount = () => {
    MyCustomEvent.removeEventListener(
      "DELETE_DASHBOARD",
      this.onDeleteDashboard
    );
    this.stopInterval();
  };

  initialize = dashboardId => {
    if (
      LayoutContainer.state.dashboards &&
      LayoutContainer.state.dashboards.length > 0
    ) {
      this.setState({ noDashboards: false });
    }

    if (dashboardId && LayoutContainer.state.dashboards.length === 0) {
      return this.props.history.replace(`/user/dashboard`);
    }

    if (
      LayoutContainer.state.dashboards.length > 0 &&
      (dashboardId === undefined ||
        !LayoutContainer.isValidDashboardId(dashboardId))
    ) {
      const dashboard = LayoutContainer.state.dashboards[0];
      return this.props.history.replace(`/user/dashboard/${dashboard.id}`);
    }
    if (LayoutContainer.state.dashboards.length > 0) {
      this.setState({
        dashboardId,
        layouts: LayoutContainer.getLayouts(dashboardId)
      });
    }
  };

  toggleInterval = () => {
    if (TimerContainer.state.paused) {
      this.stopInterval();
    } else {
      this.startInterval();
    }
    TimerContainer.reset();
  };

  startInterval = () => {
    if (LayoutContainer.state.dashboards.length > 1) {
      this.interval = setInterval(
        this.goToNext,
        CHANGE_DASHBOARD_INTERVAL * 1000
      );
    }
  };

  stopInterval = () => clearInterval(this.interval);

  goToNext = (dashboardDeleted = false) => {
    const { dashboardId } = this.state;
    const dashboardsCount = LayoutContainer.state.dashboards.length;
    if (dashboardsCount <= 1 && dashboardDeleted) {
      return this.props.history.replace(`/user/dashboard`);
    }
    const dashboardIndex = LayoutContainer.getDashboardIndex(dashboardId);
    const nextIndex = (dashboardIndex + 1) % dashboardsCount;
    const nextId = LayoutContainer.state.dashboards[nextIndex].id;
    return this.props.history.replace(`/user/dashboard/${nextId}`);
  };

  onDeleteDashboard = async () => {
    const { dashboardId } = this.props.match.params;
    if (+dashboardId !== +this.state.dashboardId) {
      return;
    }
    const dashboard = LayoutContainer.getDashboard(this.state.dashboardId);
    if (dashboard.shared) {
      return alert(
        "داشبورد با شما به اشتراک گذاشته شده است\nنمیتوانید آن را حذف کنید"
      );
    }
    try {
      await LayoutContainer.deleteDashboard(dashboard.id);
      this.goToNext(true);
    } catch (error) {
      const msg = get(
        error,
        "response.data.message",
        "حذف داشبورد با خطا مواجه شد"
      );
      this.props.enqueueSnackbar(msg, {
        variant: "error"
      });
    } finally {
      DeleteDashboardContainer.setLoading(false);
    }
  };

  onBreakpointChange = breakpoint => {
    this.setState({ breakpoint });
  };

  render = () => {
    const { width } = this.props.size;
    const {
      layouts,
      breakpoint,
      dashboardId,
      noDashboards,
      error
    } = this.state;

    if (error) {
      return <Error message={error} />;
    }

    if (noDashboards) {
      return <Error message="هیچ داشبوردی برای شما وجود ندارد" />;
    }

    return (
      <Subscribe to={[TimerContainer]}>
        {Timer => {
          if (Timer.state.hasSwitched) {
            this.toggleInterval();
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
                        dashboardId={dashboardId}
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
        }}
      </Subscribe>
    );
  };
}

const WIthSnackbar = withSnackbar(Dashboard);
export default withSize()(WIthSnackbar);
