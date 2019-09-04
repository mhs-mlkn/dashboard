import React from "react";
import Grid from "@material-ui/core/Grid";
import Chart from "../../../../components/Chart/Chart";
import Scalar from "../../../../components/Scalar/Scalar";
import BarChartConfigt from "./BarChartConfigt";
import ScatterChartConfigt from "./ScatterChartConfigt";
import PieChartConfig from "./PieChartConfig";
import ScalarConfig from "./ScalarConfig";

import {
  Charts as ChartData,
  Scalar as ScalarData
} from "../../../../mockdata";

const ASPECT_RATIO = 16 / 9;

const ConfigReport = props => {
  const { userReport, config, onConfigChange } = props;

  const getConfigComponent = () => {
    const { type } = userReport.report;

    switch (type) {
      case "Bar":
      case "Area":
      case "Line":
        return (
          <BarChartConfigt config={config} onConfigChange={onConfigChange} />
        );

      case "Scatter":
        return (
          <ScatterChartConfigt
            config={config}
            onConfigChange={onConfigChange}
          />
        );

      case "Pie":
      case "Radar":
        return (
          <PieChartConfig
            type={type}
            config={config}
            onConfigChange={onConfigChange}
          />
        );

      case "Scalar":
        return <ScalarConfig config={config} onConfigChange={onConfigChange} />;

      default:
        break;
    }
  };

  const getPreview = () => {
    const { type } = userReport.report;

    if (type === "Scalar") {
      return <Scalar aspect={ASPECT_RATIO} data={ScalarData} config={config} />;
    }

    return (
      <Chart
        aspect={ASPECT_RATIO}
        data={ChartData}
        type={type}
        config={config}
      />
    );
  };

  return (
    <Grid container>
      <Grid item sm={12} md={5} lg={5}>
        {getConfigComponent()}
      </Grid>
      <Grid item sm={12} md={7} lg={7}>
        {getPreview()}
      </Grid>
    </Grid>
  );
};

export default ConfigReport;
