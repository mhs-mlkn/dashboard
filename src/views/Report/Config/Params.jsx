import React, { Component } from "react";
import { Formik, Form, FieldArray } from "formik";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Input, { ErrorMessage } from "../../../components/FormikInputs";
import Page from "../../../components/Page/Page";

import ReportContainer from "../../../containers/Report.container";
import LayoutContainer from "../../../containers/Layout.container";

class ReportParams extends Component {
  state = {
    report: undefined,
    drillDownReport: undefined,
    params: [],
    instanceId: undefined,
    loading: false,
    showDrillDownForm: false,
    error: ""
  };

  componentDidMount = async () => {
    const { id: reportId } = this.props.match.params;
    this.setState({ loading: true });
    try {
      await this.initialize(reportId);
    } catch (error) {
      this.setState({ loading: false, error: "خطای دریافت اطلاعات" });
    }
  };

  initialize = async reportId => {
    const report = await ReportContainer.get(reportId);
    let drillDownReport = undefined;
    if (this.hasDrillDown(report)) {
      drillDownReport = await ReportContainer.get(report.drillDownId);
    }
    const params = report
      ? report.query.queryParams.filter(
          p => ["BY_BUSINESS", "BY_BUSINESS_OR_PARENT"].indexOf(p.fill) > -1
        )
      : [];
    this.setState({
      report,
      drillDownReport,
      params,
      loading: false
    });
  };

  submit = async ({ userReportName, params }) => {
    this.setState({ loading: true });
    const { id: reportId, index = 0 } = this.props.match.params;
    await this.createInstance(reportId, userReportName, params, index);
    if (this.hasDrillDown(this.state.report)) {
      if (this.hasParams(this.state.drillDownReport)) {
        const params = this.state.drillDownReport
          ? this.state.drillDownReport.query.queryParams.filter(
              p => ["BY_BUSINESS"].indexOf(p.fill) > -1
            )
          : [];
        this.setState({ params, showDrillDownForm: true, loading: false });
        return;
      } else {
        await ReportContainer.getDrilldownInstance(
          this.state.report.drillDownId,
          this.state.instanceId,
          []
        );
      }
    }
    await LayoutContainer.addToLayout(index, this.state.instanceId);
    this.setState({ loading: false });
    this.props.history.replace(`/user/dashboard/layout/${index}`);
  };

  submitDrillDown = async ({ params }) => {
    const { index = 0 } = this.props.match.params;
    this.setState({ loading: true });
    await ReportContainer.getDrilldownInstance(
      this.state.report.drillDownId,
      this.state.instanceId,
      params
    );
    await LayoutContainer.addToLayout(index, this.state.instanceId);
    this.setState({ loading: false });
    this.props.history.replace(`/user/dashboard/layout/${index}`);
  };

  createInstance = async (reportId, userReportName, params, dashboardIndex) => {
    const dashboardId = LayoutContainer.getDashboard(dashboardIndex).id;
    const instanceId = await ReportContainer.getReportInstance(
      reportId,
      userReportName,
      params,
      dashboardId
    );
    return this.setState({ instanceId });
  };

  hasDrillDown = report => report.drillDownId > -1;

  hasParams = report =>
    report.query.queryParams.some(p => ["BY_BUSINESS"].indexOf(p.fill) > -1);

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
    const { report, drillDownReport, showDrillDownForm } = this.state;
    if (showDrillDownForm) {
      return (
        <Form>
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              <Typography variant="h5" color="textPrimary" gutterBottom>
                پارامترهای گزارش {drillDownReport ? drillDownReport.name : null}
              </Typography>
            </Grid>
          </Grid>
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
    }
    return (
      <Form>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant="h5" color="textPrimary" gutterBottom>
              پارامترهای گزارش {report ? report.name : null}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={12} md={3}>
            <Input
              name="userReportName"
              label="عنوان نمایشی گزارش"
              value={values.userReportName}
              {...props}
            />
          </Grid>
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
    const { showDrillDownForm, loading, error } = this.state;
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
            userReportName: "",
            params: this.state.params
          }}
          enableReinitialize={true}
          validate={this.validate}
          onSubmit={showDrillDownForm ? this.submitDrillDown : this.submit}
          render={this.renderForm}
        />
      </Page>
    );
  }
}

export default ReportParams;
