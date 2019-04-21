import React from "react";
import Grid from "@material-ui/core/Grid";
import Chart from "../../../../components/Chart/Chart";
import BarCharConfigt from "./BarCharConfigt";
import PieCharConfig from "./PieCharConfig";

import { Charts as ChartData } from "../../../../mockdata";

const ASPECT_RATIO = 16 / 9;

const ConfigReport = props => {
  const { userReport, config, onConfigChange } = props;

  const getConfigComponent = reportType => {
    switch (reportType) {
      case "Bar":
      case "Area":
      case "Line":
        return (
          <BarCharConfigt config={config} onConfigChange={onConfigChange} />
        );

      case "Pie":
      case "Radar":
        return (
          <PieCharConfig config={config} onConfigChange={onConfigChange} />
        );

      default:
        break;
    }
  };

  return (
    <Grid container>
      <Grid item sm={12} md={12} lg={6}>
        {getConfigComponent(userReport.report.type)}
      </Grid>
      <Grid item sm={12} md={12} lg={6}>
        <Chart
          aspect={ASPECT_RATIO}
          data={ChartData}
          type={userReport.report.type}
          config={config}
        />
      </Grid>
    </Grid>
  );
};

export default ConfigReport;
