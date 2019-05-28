import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

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
  const { classes, axisConfig, layout, onChange } = props;

  const { height = 30, unit = "", label = "", divideBy = 0 } = axisConfig;

  const handleChange = ({ target }) => {
    // console.log(target.name, target.value);
    onChange({ xAxis: { ...axisConfig, [target.name]: target.value } });
  };

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">محمور افقی</FormLabel>
      <TextField
        name="height"
        label="ارتفاع"
        type="number"
        value={height}
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
        disabled={layout === "horizontal"}
        className={classes.textField}
      />
      <TextField
        name="label"
        label="برچسب"
        value={label}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        select
        name="divideBy"
        label="تقسیم بر 10 به توان"
        value={divideBy}
        onChange={handleChange}
        helperText="انتخاب مقیاس اعداد محور"
        margin="dense"
        variant="outlined"
        disabled={layout === "horizontal"}
        className={classes.textField}
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
