import React, { Component } from "react";
import { Formik, Form, FieldArray } from "formik";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input, { ErrorMessage } from "../../../components/FormikInputs";
import Page from "../../../components/Page/Page";

import ReportContainer from "../../../containers/Report.container";

class ReportParams extends Component {
  state = {
    report: undefined,
    params: [],
    loading: false
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const id = +this.props.match.params.id;
    const report = await ReportContainer.get(id);
    const params = report
      ? report.query.queryParams.filter(
          p => ["BY_BUSINESS", "BY_BUSINESS_OR_PARENT"].indexOf(p.fill) > -1
        )
      : [];
    this.setState({ loading: false, report, params });
  };

  submit = async values => {
    this.setState({ loading: true });
    const { index = 0 } = +this.props.match.params;
    const instanceId = await ReportContainer.getReportInstance(
      this.state.report.id,
      values.params
    );
    await ReportContainer.addToLayout(index, instanceId);
    this.props.history.push(`/user/dashboard/layout/${index}`);
    this.setState({ loading: false });
  };

  validate = values => {
    const errors = { params: [] };
    const { params } = values;
    for (const p of params) {
      if (!p.value) {
        errors.params.push({ value: "مقدار وراد کنید" });
      } else if (p.type === "number" && !Number(p.value)) {
        errors.params.push({ value: "عدد وراد کنید" });
      } else if (
        p.type === "boolean" &&
        ["true", "false"].indexOf(p.value.toLowerCase()) < 0
      ) {
        errors.params.push({ value: "true یا false وارد کنید" });
      } else {
        errors.params.push({ value: "" });
      }
    }
    for (const p of errors.params) {
      if (p.value) {
        return errors;
      }
    }
    return {};
  };

  renderForm = props => {
    const { values } = props;
    return (
      <Form>
        <Grid container>
          <FieldArray
            name="params"
            render={() => {
              return values.params.map((p, i) => (
                <Grid item xs={12} sm={12} md={3} key={p.key}>
                  <Input
                    name={`params.${i}.value`}
                    label={p.key}
                    value={values.params[i].value}
                    {...props}
                  />
                  <FormHelperText>
                    {p.hint} ({p.type})
                  </FormHelperText>
                  <ErrorMessage name={`params.${i}.value`} />
                </Grid>
              ));
            }}
          />
          <Grid item xs={12} sm={12} md={12}>
            <Button
              type="submit"
              color="primary"
              variant="outlined"
              style={{ marginTop: "40px" }}
            >
              ادامه
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  };

  render() {
    const { loading, error } = this.state;
    return (
      <Page
        title="تنظیم گزارش"
        icon="settings"
        loading={loading}
        error={error}
        onClose={this.onCloseError}
      >
        <Formik
          initialValues={{
            params: this.state.params
          }}
          enableReinitialize={true}
          validate={this.validate}
          onSubmit={this.submit}
          render={this.renderForm}
        />
      </Page>
    );
  }
}

export default ReportParams;
