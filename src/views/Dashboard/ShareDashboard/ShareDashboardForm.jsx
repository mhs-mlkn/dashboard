import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input, { DatePicker } from "../../../components/FormikInputs";

const initialValues = { identity: "", expire: null };

class ShareDashboardForm extends Component {
  submit = (values, { resetForm, setSubmitting }) => {
    setTimeout(() => {
      this.props.onSubmit(values);
      setSubmitting(false);
      resetForm(initialValues);
    }, 0);
  };

  validate = values => {
    let errors = {};
    if (!values.identity) {
      errors.identity = "مشخصات کاربر را وارد کنید";
    }
    if (!values.expire) {
      errors.expire = "تاریخ انقضای اشتراک را انتخاب نمایید";
    }
    return errors;
  };

  renderForm = formikProps => {
    return (
      <Form autoComplete="off">
        <Grid container>
          <Grid item xs={12} md={8}>
            <Input
              name="identity"
              label="نام کاربری، ایمیل یا شماره همراه"
              {...formikProps}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Field
              name="expire"
              label="انقضا"
              disablePast
              component={DatePicker}
              style={{ paddingLeft: 0 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ borderRadius: 0 }}
            >
              تایید
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  };

  render = () => {
    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validate={this.validate}
        onSubmit={this.submit}
        render={this.renderForm}
      />
    );
  };
}

export default ShareDashboardForm;
