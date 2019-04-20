import React from "react";
import Grid from "@material-ui/core/Grid";
import ChartLayoutConfig from "./ChartLayoutConfig";
import Switch from "./Switch";

const BarCharConfigt = props => {
  const { config, onConfigChange } = props;

  const { layout, stacked, brush } = config;

  const handleChange = override => {
    onConfigChange({ ...config, ...override });
  };

  return (
    <Grid container>
      <Grid item sm={12} md={12} lg={6}>
        <ChartLayoutConfig layout={layout} onChange={handleChange} />
        <Switch
          name="stacked"
          label="نمایش پشته ای"
          value={stacked}
          onChange={handleChange}
        />
        <Switch
          name="brush"
          label="ابزار زوم"
          value={brush}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default BarCharConfigt;
