import React, { Component } from "react";
import { pickBy, identity } from "lodash";
import { Formik, Form } from "formik";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import TextInput from "@material-ui/core/TextField";
import { DatePicker } from "react-advance-jalaali-datepicker";
import moment from "moment-jalaali";

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
    // const { queryFilters } = this.props.report.query;
    values = pickBy(values, identity);
    const filters = [];
    if (Object.keys(values).length === 0) {
      return filters;
    }
    for (const p in values) {
      // const filter = queryFilters.find(f => f.id === p);
      filters.push({ id: p, value: values[p] });
    }
    return filters;
  };

  getInitials = (values, formikProps) => {
    const initials = {};
    if (values && Object.keys(values).length > 0) {
      for (const val of values) {
        initials[val.id] = val.value;
      }
      return initials;
    }
    const { queryFilters: filters } = this.props.report.query;
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
        return (
          <DatePicker
            inputComponent={props => {
              return (
                <TextInput
                  id={`${id}-${key}`}
                  name={name}
                  label={title}
                  inputProps={{ ...props }}
                />
              );
            }}
            format="jYYYY/jMM/jDD"
            preSelected={
              props.values[name] &&
              moment(props.values[name]).format("jYYYY/jMM/jDD")
            }
            onChange={(_, date) =>
              props.setFieldValue(
                name,
                moment(date, "jYYYY/jMM/jDD").format("YYYY-MM-DD")
              )
            }
          />
        );
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
            onChange={props.handleChange}
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
              <Grid
                item
                xs={12}
                sm={12}
                md={3}
                key={f.id}
                style={{ marginTop: "20px" }}
              >
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

export default Filters;
