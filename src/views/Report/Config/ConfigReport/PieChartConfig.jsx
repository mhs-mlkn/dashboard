import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ChartLegendConfig from "./ChartLegendConfig";
import { PIE_LABEL_RENDER_TYPE } from "../../../../constants";

const PieCharConfigt = props => {
  const { config, onConfigChange, type } = props;

  const {
    innerRadius = 0,
    outerRadius = 80,
    labelRenderType = PIE_LABEL_RENDER_TYPE.SIMPLE,
    legend,
    labelValue = {
      label: true,
      value: true,
      percent: true
    }
  } = config;

  const handleChange = override => {
    onConfigChange({ ...config, ...override });
  };

  const handleLabelCheckbox = ({ target }) => {
    handleChange({
      labelValue: {
        ...labelValue,
        [target.name]: target.checked
      }
    });
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
          inputProps={{ min: 0, max: outerRadius - 5, step: 5 }}
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
      {type === "Pie" && (
        <>
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
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <FormGroup
              row
              style={{
                display:
                  labelRenderType === PIE_LABEL_RENDER_TYPE.SIMPLE
                    ? "none"
                    : "block"
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="label"
                    value="label"
                    checked={labelValue.label}
                    onChange={handleLabelCheckbox}
                    color="primary"
                  />
                }
                label="عنوان"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="value"
                    value="value"
                    checked={labelValue.value}
                    onChange={handleLabelCheckbox}
                    color="primary"
                  />
                }
                label="مقدار"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="percent"
                    value="percent"
                    checked={labelValue.percent}
                    onChange={handleLabelCheckbox}
                    color="primary"
                  />
                }
                label="درصد"
              />
            </FormGroup>
          </Grid>
        </>
      )}
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <ChartLegendConfig legendConfig={legend} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default PieCharConfigt;
