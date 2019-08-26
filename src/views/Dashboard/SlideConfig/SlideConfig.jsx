import React from "react";
import { Subscribe } from "unstated";
import { Formik, Form, FieldArray } from "formik";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import LayoutContainer from "../../../containers/Layout.container";
import DashboardCard from "./DashboardCard";

const DashboardSlideConfig = () => {
  const [loading, setLoading] = React.useState(false);

  const submit = async values => {
    setLoading(true);
    await LayoutContainer.saveDashboardsConfig(values.dashboards);
    setLoading(false);
  };

  const validate = values => {
    const errors = { dashboards: [] };
    const { dashboards } = values;
    for (const d of dashboards) {
      const duration = d.config.slide.duration;
      if (!duration) {
        errors.dashboards.push({ duration: "مقدار وارد کنید" });
      } else if (!Number(duration)) {
        errors.dashboards.push({ duration: "عدد وارد کنید" });
      } else if (Number(duration) < 10) {
        errors.dashboards.push({ duration: "حداقل 10 ثانیه مجاز میباشد" });
      }
    }
    for (const d of errors.dashboards) {
      if (d.duration) {
        return errors;
      }
    }
    return {};
  };

  const renderForm = formikProps => {
    const { values } = formikProps;
    // console.dir(values);
    return (
      <Form>
        <Grid container direction="row-reverse" spacing={8}>
          <FieldArray
            name="dashboards"
            render={() =>
              values.dashboards.map((d, i) => (
                <Grid key={d.id} item xs={12} sm={4} md={3} lg={3}>
                  <DashboardCard
                    dashboard={d}
                    formikProps={formikProps}
                    index={i}
                  />
                </Grid>
              ))
            }
          />
        </Grid>
        <Fab
          title="ذخیره"
          color="primary"
          size="medium"
          className="fab"
          onClick={formikProps.submitForm}
        >
          {loading ? <CircularProgress color="secondary" /> : <SaveIcon />}
        </Fab>
      </Form>
    );
  };

  return (
    <Subscribe to={[LayoutContainer]}>
      {Layout => (
        <Formik
          initialValues={{
            dashboards: Layout.state.dashboards
          }}
          enableReinitialize={true}
          validate={validate}
          onSubmit={submit}
          render={renderForm}
        />
      )}
    </Subscribe>
  );
};

export default DashboardSlideConfig;
