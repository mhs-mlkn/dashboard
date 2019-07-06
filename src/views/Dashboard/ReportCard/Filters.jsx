import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { pickBy, identity } from "lodash";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import TextInput from "@material-ui/core/TextField";
import { DatePicker } from "../../../components/FormikInputs";
import moment from "moment-jalaali";

const styles = theme => ({
  textField: {
    paddingRight: theme.spacing.unit
  }
});

class Filters extends Component {
  submit = values => {
    const hasFiltersChanged = this.hasFiltersChanged(values);
    if (hasFiltersChanged) {
      this.prevValues = { ...values };
      this.props.onSubmit(this.convertFilters(values));
    }
  };

  hasFiltersChanged = values => {
    const { values: oldValues } = this.props;
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        const oldValue = oldValues[key];
        const curValue = values[key];
        if (oldValue !== curValue) {
          return true;
        }
      }
    }
    return false;
  };

  convertFilters = values => {
    const { queryFilters } = this.props.report.query;
    values = pickBy(values, identity);
    const filters = [];
    if (Object.keys(values).length === 0) {
      return filters;
    }
    for (const p in values) {
      const filter = queryFilters.find(f => f.id === +p);
      filters.push({
        id: p,
        value:
          filter.type === "DATE" ? values[p].format("YYYY-MM-DD") : values[p]
      });
    }
    return filters;
  };

  getInitials = (values, formikProps) => {
    const initials = {};
    const { queryFilters: filters } = this.props.report.query;
    if (values && Object.keys(values).length > 0) {
      for (const val of values) {
        const filter = filters.find(f => f.id === +val.id);
        initials[val.id] =
          filter.type === "DATE" ? moment(val.value) : val.value;
      }
      return initials;
    }
    for (const filter of filters) {
      if (formikProps && formikProps.setFieldValue) {
        formikProps.setFieldValue(filter.id + "", "");
      }
      initials[filter.id] = "";
    }
    return initials;
  };

  getInputElement = ({ id, key, title, type }, props) => {
    const name = id + "";
    switch (type) {
      case "DATE":
      case "DATE_STRING":
        return <Field name={name} label={title} component={DatePicker} />;

      case "BOOLEAN":
        return (
          <FormControlLabel
            control={
              <Switch
                id={`${id}-${key}`}
                checked={props.values[name]}
                onChange={props.handleChange}
                value={props.values[name]}
                color="primary"
              />
            }
            label={title}
            labelPlacement="start"
          />
        );

      default:
        return (
          <TextInput
            id={`${id}-${key}`}
            name={name}
            label={title}
            value={props.values[name]}
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={props.handleChange}
            className={this.props.classes.textField}
          />
        );
    }
  };

  renderForm = props => {
    const { queryFilters: filters } = this.props.report.query;
    return (
      <Form style={{ width: "100%" }}>
        <Grid container>
          {filters.map(f => {
            return (
              <Grid item xs={12} sm={4} md={2} key={f.id}>
                {this.getInputElement(f, props)}
              </Grid>
            );
          })}
          <Grid container justify="flex-end">
            <Button
              type="button"
              color="secondary"
              onClick={() => props.resetForm(this.getInitials(null, props))}
            >
              پاک کردن
            </Button>
            <Button type="submit" color="primary">
              تایید
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  };

  render = () => {
    const { values } = this.props;

    return (
      <Formik
        initialValues={this.getInitials(values)}
        onSubmit={this.submit}
        render={this.renderForm}
      />
    );
  };
}

export default withStyles(styles)(Filters);
