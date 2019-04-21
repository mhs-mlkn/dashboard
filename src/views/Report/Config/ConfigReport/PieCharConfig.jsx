import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ChartLegendConfig from "./ChartLegendConfig";

const BarCharConfigt = props => {
  const { config, onConfigChange } = props;

  const { innerRadius = 0, legend } = config;

  const handleChange = override => {
    onConfigChange({ ...config, ...override });
  };

  return (
    <Grid container>
      <Grid item sm={12} md={12} lg={6}>
        <TextField
          name="innerRadius"
          label="innerRadius"
          value={innerRadius}
          onChange={e => handleChange({ [e.target.name]: e.target.value })}
          margin="normal"
          variant="outlined"
          type="number"
          inputProps={{ min: 0, step: 5 }}
        />
        <ChartLegendConfig legendConfig={legend} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default BarCharConfigt;
