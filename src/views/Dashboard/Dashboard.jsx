import React, { Component } from "react";
import { Subscribe } from "unstated";
import { withSize } from "react-sizeme";
import ReactGridLayout from "react-grid-layout";
import ReportContainer from "../../containers/Report.container";
import ReportCard from "./ReportCard/ReportCard";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

class Dashboard extends Component {
  layout = [];

  onLayoutChange = async layout => {
    this.layout = layout;
  };

  render = () => {
    const { width } = this.props.size;
    return (
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
                    <ReportCard layout={layout} editEnabled={false} />
                  </div>
                );
              })}
            </ReactGridLayout>
          );
        }}
      </Subscribe>
    );
  };
}

export default withSize()(Dashboard);
