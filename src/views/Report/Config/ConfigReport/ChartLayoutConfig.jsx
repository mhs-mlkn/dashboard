import React from "react";
import { withStyles } from "@material-ui/core/styles";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const styles = theme => ({
  group: {
    display: "block"
  },
  radio: {
    paddingRight: "4px"
  }
});

const ChartLayoutConfig = props => {
  const { classes, layout, onChange } = props;

  const handleChange = ({ target }) => {
    onChange({ layout: target.value });
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">چینش نمودار</FormLabel>
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
  );
};

export default withStyles(styles)(ChartLayoutConfig);
