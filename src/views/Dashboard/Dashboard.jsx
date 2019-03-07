import React, { Component } from "react";
import { Subscribe } from "unstated";
import { withSize } from "react-sizeme";
import ReactGridLayout from "react-grid-layout";
import ReportContainer from "../../containers/Report.container";
import ReportWrapper from "./ReportWrapper/ReportWrapper";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

class Dashboard extends Component {
  layout = [];
  state = {
    editEnabled: false
  };

  componentDidMount = async () => {
    document.addEventListener(
      "EDIT_LAYOUT_EVENT",
      this.toggleEditLayout,
      false
    );
  };

  componentWillUnmount = () => {
    document.removeEventListener("EDIT_LAYOUT_EVENT", this.toggleEditLayout);
  };

  toggleEditLayout = async e => {
    if (!e.detail) {
      await ReportContainer.saveLayout(this.layout);
    }
    await ReportContainer.toggleEditing(e.detail);
    this.setState({ editEnabled: e.detail });
  };

  onLayoutChange = async layout => {
    this.layout = layout;
  };

  render = () => {
    const { editEnabled } = this.state;
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
                    <ReportWrapper
                      reportId={layout.i}
                      editEnabled={editEnabled}
                    />
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
