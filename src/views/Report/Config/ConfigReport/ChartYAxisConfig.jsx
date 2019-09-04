import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { AXIS_SCALES } from "../../../../constants/index";

const styles = theme => ({
  formControl: {
    marginBottom: theme.spacing.unit * 2
  },
  textField: {
    marginRight: theme.spacing.unit,
    maxWidth: "70%"
  }
});

const ChartYAxisConfig = props => {
  const { classes, isScatter = false, axisConfig, layout, onChange } = props;

  const {
    width = 60,
    angle = 0,
    unit = "",
    label = "",
    scale = "auto",
    divideBy = 0
  } = axisConfig;

  const handleChange = ({ target }) => {
    onChange({ yAxis: { ...axisConfig, [target.name]: target.value } });
  };

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">محور عمودی</FormLabel>
      <TextField
        name="width"
        label="فاصله از چپ"
        type="number"
        value={width}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        name="angle"
        label="زاویه برچسب ها"
        type="number"
        value={angle}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        name="unit"
        label="واحد"
        value={unit}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        disabled={!isScatter ? layout === "vertical" : false}
        className={classes.textField}
      />
      <TextField
        name="label"
        label="عنوان"
        value={label}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.textField}
      />
      {!isScatter && (
        <TextField
          select
          name="scale"
          label="مقیاس"
          className={classes.textField}
          value={scale}
          onChange={handleChange}
          margin="dense"
          variant="outlined"
          disabled={layout === "vertical"}
        >
          {AXIS_SCALES.map(sc => (
            <MenuItem key={sc} value={sc}>
              {sc}
            </MenuItem>
          ))}
        </TextField>
      )}
      <TextField
        select
        name="divideBy"
        label="تقسیم بر 10 به توان"
        className={classes.textField}
        value={divideBy}
        onChange={handleChange}
        helperText="انتخاب مقیاس اعداد محور"
        margin="dense"
        variant="outlined"
        disabled={!isScatter ? layout === "vertical" : false}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
          <MenuItem key={digit} value={digit}>
            {digit}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};

export default withStyles(styles)(ChartYAxisConfig);
