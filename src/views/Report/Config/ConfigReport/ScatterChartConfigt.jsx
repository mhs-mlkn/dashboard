import React from "react";
import Grid from "@material-ui/core/Grid";
import ChartYAxisConfig from "./ChartYAxisConfig";
import ChartXAxisConfig from "./ChartXAxisConfig";
import ChartTickConfig from "./ChartTickConfig";
import { getValue } from "../../../../util";
import Theme from "../../../../containers/Theme.container";

const BarCharConfigt = props => {
  const { config, onConfigChange } = props;

  const { yAxis, xAxis } = config;

  const handleChange = override => {
    onConfigChange({ ...config, ...override });
  };

  const handleTickChange = axis => override => {
    onConfigChange({
      ...config,
      [axis]: {
        ...config[axis],
        tick: { ...getValue(config[axis].tick, Theme.state.type), ...override }
      }
    });
  };

  return (
    <Grid container>
      <Grid container>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={6}
          style={{ marginBottom: "20px" }}
        >
          <Grid container>
            <Grid container>
              <Grid item xs={6} sm={6} md={6}>
                <ChartYAxisConfig
                  isScatter
                  axisConfig={yAxis}
                  layout="horizontal"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <ChartXAxisConfig
                  isScatter
                  axisConfig={xAxis}
                  layout="horizontal"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          style={{ marginBottom: "20px" }}
        >
          <ChartTickConfig
            title="تنظیمات فونت محور افقی"
            tickConfig={getValue(xAxis.tick, Theme.state.type) || {}}
            onChange={handleTickChange("xAxis")}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          style={{ marginBottom: "20px" }}
        >
          <ChartTickConfig
            title="تنظیمات فونت محور عمودی"
            tickConfig={getValue(yAxis.tick, Theme.state.type) || {}}
            onChange={handleTickChange("yAxis")}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BarCharConfigt;
