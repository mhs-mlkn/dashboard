import React, { Component } from "react";
import Chart from "../../../components/Chart/Chart";
import data from "../../../mockdata";
// import Toolbar from "./Toolbar";

class ChartWrapper extends Component {
  render = () => {
    const { reportId } = this.props;

    return (
      <>
        <Chart data={data} type="Bar" />
      </>
    );
  };
}

export default ChartWrapper;
