import React from "react";
import Grid from "@material-ui/core/Grid";
import ChartLayoutConfig from "./ChartLayoutConfig";
import Switch from "./Switch";
import ChartLegendConfig from "./ChartLegendConfig";

const BarCharConfigt = props => {
  const { config, onConfigChange } = props;

  const { layout, stacked, brush, legend } = config;

  const handleChange = override => {
    onConfigChange({ ...config, ...override });
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={5} md={5} lg={5} style={{ marginBottom: "20px" }}>
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
        </Grid>
      </Grid>
      <Grid item xs={12} sm={7} md={7} lg={7}>
        <ChartLegendConfig legendConfig={legend} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default BarCharConfigt;
