import React from "react";
import Grid from "@material-ui/core/Grid";
import ChartLayoutConfig from "./ChartLayoutConfig";
import Switch from "./Switch";
import ChartLegendConfig from "./ChartLegendConfig";
import ChartYAxisConfig from "./ChartYAxisConfig";
import ChartXAxisConfig from "./ChartXAxisConfig";

const BarCharConfigt = props => {
  const { config, onConfigChange } = props;

  const { layout, stacked, brush, legend, yAxis, xAxis } = config;

  const handleChange = override => {
    onConfigChange({ ...config, ...override });
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={6} lg={6} style={{ marginBottom: "20px" }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <ChartLayoutConfig layout={layout} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Switch
              name="stacked"
              label="نمایش پشته ای"
              value={stacked}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Switch
              name="brush"
              label="ابزار زوم"
              value={brush}
              onChange={handleChange}
            />
          </Grid>
          <Grid container>
            <Grid item xs={6} sm={6} md={6}>
              <ChartYAxisConfig
                axisConfig={yAxis}
                layout={layout}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <ChartXAxisConfig
                axisConfig={xAxis}
                layout={layout}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={6}>
        <ChartLegendConfig legendConfig={legend} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default BarCharConfigt;
