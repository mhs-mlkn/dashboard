import React from "react";
import CustomTextarea from "../CustomInput/CustomTextarea";

const Input = props => {
  const {
    name,
    label,
    multiline = true,
    rows = 1,
    leftAlign = false,
    onBlur
  } = props;
  const touched = props.touched[name];
  const error = props.errors[name];
  const hasError = !!props.errors[name];
  return (
    <CustomTextarea
      name={name}
      id={`id-${name}`}
      label={label}
      multiline={multiline}
      rows={rows}
      formControlProps={{
        fullWidth: true,
        error: touched && hasError
      }}
      inputProps={{
        id: `id-${name}`,
        name,
        onBlur: e => {
          onBlur && onBlur(e);
          props.handleBlur(e);
        },
        onChange: props.handleChange,
        value: props.values[name]
      }}
      value={props.values[name]}
      error={touched && hasError}
      errorMessage={error}
      leftAlign={leftAlign}
    >
      {props.children}
    </CustomTextarea>
  );
};

export default Input;
