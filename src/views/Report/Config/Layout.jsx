import React, { Component } from "react";
import { Prompt } from "react-router";
import { Subscribe } from "unstated";
import { withSnackbar } from "notistack";
import { withSize } from "react-sizeme";
import ReactGridLayout from "react-grid-layout";
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
    index: 0,
    loading: false,
    error: ""
  };

  componentDidMount = async () => {
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
      return this.props.history.replace(`/user/dashboard/layout/0`);
    }
    this.setState({ index });
  };

  onLayoutChange = async layout => {
    const { index } = this.state;
    const { dashboards } = LayoutContainer.state;
    const savedLayout = dashboards[index].config.layout;
    const isLayoutDirty = hasLayoutChanged(layout, savedLayout);

    if (isLayoutDirty) {
      await LayoutContainer.onLayoutChange(index, layout);
    }
  };

  onSettingsChange = async (userReportId, settings) => {
    await LayoutContainer.onSettingsChange(
      this.state.index,
      userReportId,
      settings
    );
  };

  save = async () => {
    try {
      const { index } = this.state;
      this.setState({ loading: true });
      await LayoutContainer.saveDashboard(index);
      this.setState({ loading: false });
      this.props.enqueueSnackbar("با موفقیت ذخیره شد", { variant: "success" });
    } catch (error) {
      this.setState({ loading: false });
      this.props.enqueueSnackbar("با خطا مواجه شد", { variant: "error" });
    }
  };

  render = () => {
    const { width } = this.props.size;
    const { index, error, loading } = this.state;

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
              <Prompt
                when={Layout.state.isDirty}
                message={`تغییرات را دخیره نکرده اید. در صورت بارگذاری مجدد تغییرات شما از بین خواهد رفت، آیا ادامه میدهید؟`}
              />
              <ReactGridLayout
                width={width}
                className="layout"
                cols={24}
                rowHeight={10}
                layout={layout}
                onDragStop={this.onLayoutChange}
                onResizeStop={this.onLayoutChange}
                style={{ direction: "ltr" }}
              >
                {layout.map(l => {
                  l.static = false;
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
              </ReactGridLayout>
              <Fab
                title="ذخیره"
                color="primary"
                size="medium"
                className="fab"
                onClick={this.save}
              >
                {loading ? (
                  <CircularProgress color="secondary" />
                ) : (
                  <SaveIcon />
                )}
              </Fab>
              <ConfigReportDialog
                dashboardIndex={index}
                onSettingsChange={this.onSettingsChange}
              />
            </>
          );
        }}
      </Subscribe>
    );
  };
}

const WIthSnackbar = withSnackbar(DashboardLayout);

export default withSize()(WIthSnackbar);
