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
    loading: false,
    error: ""
  };

  componentDidMount() {
    const id = +this.props.match.params.id;
    const report = ReportContainer.state.reports.find(r => r.id === id);
    const params = report ? report.query.queryParams : [];
    this.setState({ report, params });
  }

  submit = async values => {
    this.setState({ loading: true, error: "" });
    // send data back to server
    ReportContainer.setParams(this.state.report.id, values.params)
      .then(async instanceId => {
        await ReportContainer.addLayout(instanceId, this.state.report.id);
        this.props.history.push("/reports/config/layout");
      })
      .catch(error => this.setState({ loading: false, error: error.message }));
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

  onCloseError = () => {
    this.setState({ error: "" });
  };

  renderForm = props => {
    const { values } = props;
    return (
      <Form>
        <Grid xs={12} sm={12} md={3}>
          <FieldArray
            name="params"
            render={() => {
              return values.params.map((p, i) => (
                <div key={p.key}>
                  <Input name={`params.${i}.value`} label={p.key} {...props} />
                  <FormHelperText>
                    {p.hint} ({p.type})
                  </FormHelperText>
                  <ErrorMessage name={`params.${i}.value`} />
                </div>
              ));
            }}
          />
          <Button type="submit" color="primary" style={{ marginTop: "20px" }}>
            ادامه
          </Button>
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
