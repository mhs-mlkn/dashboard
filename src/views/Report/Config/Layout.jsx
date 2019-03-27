import React, { Component } from "react";
import { Subscribe } from "unstated";
import { withSnackbar } from "notistack";
import { withSize } from "react-sizeme";
import ReactGridLayout from "react-grid-layout";
import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import Error from "../../../components/Error/Error";
import LayoutContainer from "../../../containers/Layout.container";
import ReportCard from "../../Dashboard/ReportCard/ReportCard";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

class DashboardLayout extends Component {
  state = {
    index: 0,
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
    await LayoutContainer.onLayoutChange(index, layout);
  };

  save = async () => {
    try {
      const { index } = this.state;
      await LayoutContainer.saveLayout(index);
      this.props.enqueueSnackbar("با موفقیت ذخیره شد", { variant: "success" });
    } catch (error) {
      this.props.enqueueSnackbar("با خطا مواجه شد", { variant: "error" });
    }
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
                    <div key={l.i} data-grid={l} style={{ direction: "rtl" }}>
                      <ReportCard layout={l} editEnabled={true} />
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
                <SaveIcon />
              </Fab>
            </>
          );
        }}
      </Subscribe>
    );
  };
}

const WIthSnackbar = withSnackbar(DashboardLayout);

export default withSize()(WIthSnackbar);
