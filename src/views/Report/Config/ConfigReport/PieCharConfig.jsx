import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import ChartLegendConfig from "./ChartLegendConfig";

const PieCharConfigt = props => {
  const { config, onConfigChange } = props;

  const { innerRadius = 0, legend } = config;

  const handleChange = override => {
    onConfigChange({ ...config, ...override });
  };

  return (
    <Grid container direction="column" spacing={16}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
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
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <ChartLegendConfig legendConfig={legend} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default PieCharConfigt;
