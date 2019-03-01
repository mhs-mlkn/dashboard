import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  textField: {
    paddingRight: theme.spacing.unit
  }
});

const Input = props => {
  const {
    name,
    label,
    value = "",
    select = false,
    multiline = false,
    type = "text",
    classes
  } = props;
  const touched = props.touched[name];
  const error = props.errors[name];
  const hasError = !!props.errors[name];
  return (
    <TextField
      select={select}
      multiline={multiline}
      name={name}
      id={`${name}-id`}
      label={label}
      value={props.values[name] || value}
      type={type}
      onChange={props.handleChange}
      margin="normal"
      variant="outlined"
      fullWidth
      error={touched && hasError}
      helperText={touched && hasError && error}
      inputProps={{
        name: name,
        id: `${name}-id`,
        onChange: props.handleChange,
        onBlur: props.handleBlur
      }}
      className={classes.textField}
    >
      {props.children}
    </TextField>
  );
};

export default withStyles(styles)(Input);
