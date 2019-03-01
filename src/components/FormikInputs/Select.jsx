import React from "react";
import TextField from "@material-ui/core/TextField";

const Input = props => {
  const { name, label, value = props.values[name] } = props;
  const touched = props.touched[name];
  const error = props.errors[name];
  const hasError = !!props.errors[name];
  return (
    <TextField
      name={name}
      id={`${name}-id`}
      label={label}
      value={value}
      select
      onChange={props.handleChange}
      margin="normal"
      variant="outlined"
      fullWidth
      error={touched && hasError}
      helperText={error}
      inputProps={{
        onBlur: props.handleBlur
      }}
    >
      {props.children}
    </TextField>
  );
};

export default Input;
