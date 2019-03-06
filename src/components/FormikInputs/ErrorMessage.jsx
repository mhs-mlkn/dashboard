import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Field, getIn } from "formik";

const ErrorMessage = ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? (
        <FormHelperText error={true}>{error}</FormHelperText>
      ) : null;
    }}
  />
);

export default ErrorMessage;
