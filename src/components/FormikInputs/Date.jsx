import React from "react";
import JalaliUtils from "@date-io/jalaali";
import { withStyles } from "@material-ui/core/styles";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";

const styles = theme => ({
  textField: {
    paddingRight: theme.spacing.unit
  }
});

const DatePickerField = ({ field, form, classes, ...other }) => {
  const currentError = form.errors[field.name];

  const handleChange = date => {
    form.setFieldValue(field.name, date, true);
  };

  const handleError = (_, error) => {
    form.setFieldError(field.name, error);
  };

  const labelFunc = date => {
    return date ? date.format("jYYYY/jMM/jDD") : "";
  };

  const touched = form.touched[field.name];

  return (
    <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
      <DatePicker
        clearable
        autoOk
        disablePast
        okLabel="تایید"
        cancelLabel="لغو"
        clearLabel="پاک کردن"
        name={field.name}
        value={field.value}
        format="jYYYY/jMM/jDD"
        labelFunc={labelFunc}
        helperText={touched && currentError}
        error={touched && Boolean(currentError)}
        onError={handleError}
        onChange={handleChange}
        mask={value =>
          value
            ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]
            : []
        }
        label="انقضا"
        variant="outlined"
        margin="normal"
        fullWidth
        className={classes.textField}
        {...other}
      />
    </MuiPickersUtilsProvider>
  );
};

export default withStyles(styles)(DatePickerField);
