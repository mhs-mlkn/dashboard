import React, { Component } from "react";
import { Subscribe } from "unstated";
import { withSize } from "react-sizeme";
import ReactGridLayout from "react-grid-layout";
import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import ReportContainer from "../../../containers/Report.container";
import ReportCard from "../../Dashboard/ReportCard/ReportCard";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

class DashboardLayout extends Component {
  componentDidMount = async () => {
    await ReportContainer.setEditLayout(true);
  };

  componentWillUnmount = async () => {
    await ReportContainer.setEditLayout(false);
  };

  onLayoutChange = async layout => {
    ReportContainer.setLayout(layout);
  };

  saveLayout = async () => {
    await ReportContainer.saveLayout();
  };

  render = () => {
    const { width } = this.props.size;
    return (
      <>
        <Subscribe to={[ReportContainer]}>
          {Report => {
            return (
              <ReactGridLayout
                width={width}
                className="layout"
                cols={24}
                rowHeight={10}
                layout={Report.state.layout}
                onLayoutChange={this.onLayoutChange}
                style={{ direction: "ltr" }}
              >
                {Report.state.layout.map(layout => {
                  return (
                    <div
                      key={layout.i}
                      data-grid={layout}
                      style={{ direction: "rtl" }}
                    >
                      <ReportCard layout={layout} editEnabled={true} />
                    </div>
                  );
                })}
              </ReactGridLayout>
            );
          }}
        </Subscribe>
        <Fab
          title="ذخیره"
          color="primary"
          size="medium"
          className="fab"
          onClick={this.saveLayout}
        >
          <SaveIcon />
        </Fab>
      </>
    );
  };
}

export default withSize()(DashboardLayout);
