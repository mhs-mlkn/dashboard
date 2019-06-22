import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ChartLegendConfig from "./ChartLegendConfig";
import { PIE_LABEL_RENDER_TYPE } from "../../../../constants";

const PieCharConfigt = props => {
  const { config, onConfigChange } = props;

  const {
    innerRadius = 0,
    outerRadius = 0,
    labelRenderType = PIE_LABEL_RENDER_TYPE.SIMPLE,
    legend
  } = config;

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
          style={{ marginLeft: "8px" }}
        />
        <TextField
          name="outerRadius"
          label="outerRadius"
          value={outerRadius}
          onChange={e => handleChange({ [e.target.name]: e.target.value })}
          margin="normal"
          variant="outlined"
          type="number"
          inputProps={{ min: 0, step: 5 }}
        />
      </Grid>
      <Grid item xs={12} sm={4} md={4} lg={4}>
        <TextField
          select
          fullWidth
          name="labelRenderType"
          label="نمایش برچسب"
          value={labelRenderType}
          onChange={e => handleChange({ [e.target.name]: e.target.value })}
          margin="normal"
          variant="outlined"
          type="number"
        >
          [
          <MenuItem value={0} key={0}>
            نوع یک
          </MenuItem>
          <MenuItem value={1} key={1}>
            نوع دو
          </MenuItem>
          ]
        </TextField>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <ChartLegendConfig legendConfig={legend} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default PieCharConfigt;
