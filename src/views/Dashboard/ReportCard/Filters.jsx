import React, { Component } from "react";
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
    console.log(values);
    const hasFiltersChanged = this.hasFiltersChanged(values);
    if (hasFiltersChanged) {
      this.prevValues = { ...values };
      // this.props.onSubmit(this.convertFilters(values));
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
    const filters = [];
    if (Object.keys(values).length === 0) {
      return filters;
    }
    for (const p in values) {
      const filter = queryFilters.find(f => f.key === p);
      filters.push({ id: filter.id, key: p, value: values[p] });
    }
    return filters;
  };

  getInitials = values => {
    const initials = {};
    if (values && values.length > 0) {
      for (const val of values) {
        initials[val.key] = val.value;
      }
      return initials;
    }
    const { queryFilters: filters } = this.props.report.query;
    for (const filter of filters) {
      initials[filter.key] = "";
    }
    return initials;
  };

  getInputElement = ({ id, key, title, type }, props) => {
    switch (type) {
      case "DATE":
        return (
          <DatePicker
            inputComponent={props => {
              return (
                <TextInput
                  id={`${id}-${key}`}
                  name={key}
                  label={title}
                  inputProps={{ ...props }}
                />
              );
            }}
            format="jYYYY/jMM/jDD"
            preSelected={
              props.values[key] &&
              moment(props.values[key]).format("jYYYY/jMM/jDD")
            }
            onChange={(_, date) =>
              props.setFieldValue(
                key,
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
                checked={props.values[key]}
                onChange={props.handleChange}
                value={props.values[key]}
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
            name={key}
            label={title}
            value={props.values[key]}
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
            <Button type="submit" color="primary">
              تایید
            </Button>
            <Button
              type="button"
              onClick={() => props.resetForm(this.getInitials())}
            >
              پاک کردن
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
