import React, { Component } from "react";
import { Prompt } from "react-router";
import { withSnackbar } from "notistack";
import { withSize } from "react-sizeme";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import Error from "../../../components/Error/Error";
import LayoutContainer from "../../../containers/Layout.container";
import ReportCard from "../../Dashboard/ReportCard/ReportCard";
import ConfigReportDialog from "./ConfigReport/ConfigReportDialog";

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
    index: 0,
    loading: false,
    error: ""
  };

  componentDidMount = async () => {
    const { index } = this.props.match.params;
    this.initialize(index);
  };

  componentDidUpdate = async prevProps => {
    const { index: prevIndex } = prevProps.match.params;
    const { index } = this.props.match.params;
    if (prevIndex !== index) {
      this.initialize(index);
    }
  };

  initialize = index => {
    const dashboardsCount = LayoutContainer.state.dashboards.length;
    if (index === undefined || index >= dashboardsCount) {
      return this.props.history.replace(`/user/dashboard/layout/0`);
    }
    this.setState({ index, layouts: LayoutContainer.getLayouts(index) });
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
      this.state.index,
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
      const { index, layouts } = this.state;
      this.setState({ loading: true });
      await LayoutContainer.setLayouts(index, layouts);
      await LayoutContainer.saveDashboard(index);
      this.setState({ loading: false, isDirty: false });
      this.props.enqueueSnackbar("با موفقیت ذخیره شد", { variant: "success" });
    } catch (error) {
      this.setState({ loading: false });
      this.props.enqueueSnackbar("با خطا مواجه شد", { variant: "error" });
    }
  };

  render = () => {
    const { width } = this.props.size;
    const { layouts, breakpoint, isDirty, index, error, loading } = this.state;

    if (error) {
      return <Error message={error} />;
    }

    return (
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
          className="layout"
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          draggableCancel=".draggableCancel"
          style={{ direction: "ltr" }}
        >
          {layouts[breakpoint].map(l => {
            return (
              <div key={l.i} style={{ direction: "rtl" }}>
                <ReportCard
                  dashboardIndex={index}
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
          dashboardIndex={index}
          onSettingsChange={this.onSettingsChange}
        />
      </>
    );
  };
}

const WIthSnackbar = withSnackbar(DashboardLayout);

export default withSize()(WIthSnackbar);
