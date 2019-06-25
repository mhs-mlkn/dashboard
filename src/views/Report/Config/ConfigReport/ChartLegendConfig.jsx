import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = theme => ({
  formControl: {
    marginBottom: 0 //theme.spacing.unit * 2
  },
  group: {
    display: "block"
  },
  radio: {
    paddingRight: "4px"
  }
});

const ICON_TYPES = [
  "line",
  "square",
  "rect",
  "circle",
  "cross",
  "diamond",
  "star",
  "triangle",
  "wye",
  "none"
];

const ChartLegendConfig = props => {
  const { classes, legendConfig, onChange } = props;

  const {
    layout = "horizontal",
    align = "center",
    verticalAlign = "middle",
    iconType = "rect"
  } = legendConfig;

  const handleChange = ({ target }) => {
    onChange({ legend: { ...legendConfig, [target.name]: target.value } });
  };

  return (
    <FormControl component="fieldset">
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">چینش علائم نمودار</FormLabel>
        <RadioGroup
          className={classes.group}
          name="layout"
          value={layout}
          onChange={handleChange}
        >
          <FormControlLabel
            value="horizontal"
            control={<Radio color="primary" className={classes.radio} />}
            label="افقی"
          />
          <FormControlLabel
            value="vertical"
            control={<Radio color="primary" className={classes.radio} />}
            label="عمودی"
          />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">تراز افقی علائم نمودار</FormLabel>
        <RadioGroup
          className={classes.group}
          name="align"
          value={align}
          onChange={handleChange}
        >
          <FormControlLabel
            value="right"
            control={<Radio color="primary" className={classes.radio} />}
            label="راست"
          />
          <FormControlLabel
            value="center"
            control={<Radio color="primary" className={classes.radio} />}
            label="وسط"
          />
          <FormControlLabel
            value="left"
            control={<Radio color="primary" className={classes.radio} />}
            label="چپ"
          />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">تراز عمودی علائم نمودار</FormLabel>
        <RadioGroup
          className={classes.group}
          name="verticalAlign"
          value={verticalAlign}
          onChange={handleChange}
        >
          <FormControlLabel
            value="top"
            control={<Radio color="primary" className={classes.radio} />}
            label="بالا"
          />
          <FormControlLabel
            value="middle"
            control={<Radio color="primary" className={classes.radio} />}
            label="وسط"
          />
          <FormControlLabel
            value="bottom"
            control={<Radio color="primary" className={classes.radio} />}
            label="پایین"
          />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <TextField
          select={true}
          name="iconType"
          label="نوع علائم نمودار"
          value={iconType}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        >
          {ICON_TYPES.map((t, i) => (
            <MenuItem value={t} key={i}>
              {t}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </FormControl>
  );
};

export default withStyles(styles)(ChartLegendConfig);
