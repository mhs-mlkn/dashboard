import React, { Component } from "react";
import { Subscribe } from "unstated";
import { Prompt } from "react-router";
import { withSnackbar } from "notistack";
import { withSize } from "react-sizeme";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import Error from "../../../components/Error/Error";
import LayoutContainer from "../../../containers/Layout.container";
import ThemeContainer from "../../../containers/Theme.container";
import ReportCard from "../../Dashboard/ReportCard/ReportCard";
import ConfigReportDialog from "./ConfigReport/ConfigReportDialog";
import ShareReportDialog from "./ShareReport/ShareReport";
import MyCustomEvent from "../../../util/customEvent";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

function hasLayoutChanged(a, b) {
  if (a.length !== b.length) {
    return true;
  }
  for (let index = 0; index < a.length; index++) {
    const itemA = a[index];
    const itemB = b[index];
    if (
      itemA.i !== itemB.i ||
      itemA.x !== itemB.x ||
      itemA.y !== itemB.y ||
      itemA.w !== itemB.w ||
      itemA.h !== itemB.h
    ) {
      return true;
    }
  }
  return false;
}

class DashboardLayout extends Component {
  state = {
    breakpoint: "lg",
    layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
    reRender: 0,
    isDirty: false,
    dashboardId: undefined,
    loading: false,
    error: ""
  };

  componentDidMount = async () => {
    const { dashboardId } = this.props.match.params;
    this.initialize(dashboardId);
    MyCustomEvent.on("REPORT_DELETED", this.refresh);
  };

  componentDidUpdate = async prevProps => {
    const { dashboardId: prevDashboardId } = prevProps.match.params;
    const { dashboardId } = this.props.match.params;
    if (prevDashboardId !== dashboardId) {
      this.initialize(dashboardId);
    }
  };

  componentWillUnmount = () => {
    MyCustomEvent.removeEventListener("REPORT_DELETED", this.refresh);
  };

  initialize = dashboardId => {
    if (
      dashboardId === undefined ||
      !LayoutContainer.isValidDashboardId(dashboardId)
    ) {
      const dashboard = LayoutContainer.state.dashboards[0];
      return this.props.history.replace(
        `/user/dashboard/layout/${dashboard.id}`
      );
    }
    this.setState({
      dashboardId,
      layouts: LayoutContainer.getLayouts(dashboardId)
    });
  };

  refresh = () => {
    this.setState({
      layouts: LayoutContainer.getLayouts(this.state.dashboardId)
    });
  };

  onBreakpointChange = breakpoint => {
    this.setState({ breakpoint });
  };

  onLayoutChange = async (_, layouts) => {
    const { layouts: savedLayouts, breakpoint: br } = this.state;
    const isLayoutDirty = hasLayoutChanged(layouts[br], savedLayouts[br]);
    if (isLayoutDirty) {
      this.setState({ layouts: layouts, isDirty: true });
    }
  };

  onSettingsChange = async (userReportId, settings) => {
    await LayoutContainer.onSettingsChange(
      this.state.dashboardId,
      userReportId,
      settings
    );
    this.setState(({ reRender }) => ({
      isDirty: true,
      reRender: reRender + 1
    }));
  };

  save = async () => {
    try {
      const { dashboardId, layouts } = this.state;
      this.setState({ loading: true });
      await LayoutContainer.setLayouts(dashboardId, layouts);
      await LayoutContainer.saveDashboard(dashboardId);
      this.setState({ loading: false, isDirty: false });
      this.props.enqueueSnackbar("با موفقیت ذخیره شد", { variant: "success" });
    } catch (error) {
      this.setState({ loading: false });
      this.props.enqueueSnackbar("با خطا مواجه شد", { variant: "error" });
    }
  };

  render = () => {
    const { width } = this.props.size;
    const {
      layouts,
      breakpoint,
      isDirty,
      dashboardId,
      error,
      loading
    } = this.state;

    if (error) {
      return <Error message={error} />;
    }

    if (!dashboardId) {
      return <Error message={`داشبورد با شناسه ${dashboardId} وجود ندارد`} />;
    }

    return (
      <Subscribe to={[ThemeContainer]}>
        {Theme => (
          <>
            <Prompt
              when={isDirty}
              message={`تغییرات را دخیره نکرده اید. در صورت بارگذاری مجدد تغییرات شما از بین خواهد رفت، آیا ادامه میدهید؟`}
            />
            <ResponsiveGridLayout
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 24, md: 18, sm: 12, xs: 8, xxs: 2 }}
              rowHeight={10}
              width={width}
              className={
                Theme.state.type === "light" ? "layout-light" : "layout"
              }
              onBreakpointChange={this.onBreakpointChange}
              onLayoutChange={this.onLayoutChange}
              draggableCancel=".draggableCancel"
              style={{ direction: "ltr" }}
            >
              {layouts[breakpoint].map(l => {
                return (
                  <div key={l.i} style={{ direction: "rtl" }}>
                    <ReportCard
                      dashboardId={dashboardId}
                      layout={l}
                      editEnabled={true}
                    />
                  </div>
                );
              })}
            </ResponsiveGridLayout>
            <Fab
              title="ذخیره"
              color="primary"
              size="medium"
              className="fab"
              onClick={this.save}
            >
              {loading ? <CircularProgress color="secondary" /> : <SaveIcon />}
            </Fab>
            <ConfigReportDialog
              dashboardId={this.props.match.params.dashboardId}
              onSettingsChange={this.onSettingsChange}
            />
            <ShareReportDialog />
          </>
        )}
      </Subscribe>
    );
  };
}

const WIthSnackbar = withSnackbar(DashboardLayout);

export default withSize()(WIthSnackbar);
