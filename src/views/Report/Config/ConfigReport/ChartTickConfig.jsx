import React, { useState } from "react";
import { SketchPicker as ColorPicker } from "react-color";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const styles = theme => ({
  formControl: {
    // marginBottom: theme.spacing.unit * 2,
    display: "inline"
  },
  legend: {
    marginBottom: theme.spacing.unit
  },
  textField: {
    marginRight: theme.spacing.unit,
    maxWidth: "70%",
    minWidth: "70px"
  }
});

const popover = {
  position: "absolute",
  zIndex: "2"
};
const cover = {
  position: "fixed",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px"
};

const ChartYAxisConfig = props => {
  const { classes, title, tickConfig, onChange } = props;
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const {
    fill = "#e5e5e5",
    fontSize = "13",
    textAnchor = "start",
    fontFamily = "arial"
  } = tickConfig;

  const handleChange = ({ target }) => {
    onChange({ ...tickConfig, [target.name]: target.value });
  };

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend" className={classes.legend}>
        {title}
      </FormLabel>
      <TextField
        name="fill"
        label="رنگ"
        value={fill}
        onChange={handleChange}
        onClick={() => setDisplayColorPicker(true)}
        margin="dense"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        name="fontSize"
        label="اندازه فونت"
        value={fontSize}
        type="number"
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.textField}
      />
      <TextField
        select
        name="textAnchor"
        label="چینش متن"
        value={textAnchor}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.textField}
      >
        {["start", "middle", "end"].map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="fontFamily"
        label="نوع فونت"
        value={fontFamily}
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.textField}
      />
      {displayColorPicker ? (
        <div style={popover}>
          <div style={cover} onClick={() => setDisplayColorPicker(false)} />
          <ColorPicker
            color={fill}
            onChangeComplete={({ hex }) =>
              handleChange({ target: { name: "fill", value: hex } })
            }
          />
        </div>
      ) : null}
    </FormControl>
  );
};

export default withStyles(styles)(ChartYAxisConfig);
