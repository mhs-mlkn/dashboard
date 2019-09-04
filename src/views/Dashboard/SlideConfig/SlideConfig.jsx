import React from "react";
import { Subscribe } from "unstated";
import { Formik, Form, FieldArray } from "formik";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import SaveIcon from "@material-ui/icons/Save";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ViewListIcon from "@material-ui/icons/ViewList";
import LayoutContainer from "../../../containers/Layout.container";
import DashboardCard from "./DashboardCard";
import DashboardRow from "./DashboardRow";

const DashboardSlideConfig = () => {
  const [loading, setLoading] = React.useState(false);
  const [view, setView] = React.useState("LIST");

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
    return (
      <Form>
        <Grid container direction="row-reverse" spacing={8}>
          <FieldArray
            name="dashboards"
            render={() =>
              view === "GRID" ? (
                values.dashboards.map((d, i) => (
                  <Grid key={d.id} item xs={12} sm={4} md={3} lg={3}>
                    <DashboardCard
                      dashboard={d}
                      formikProps={formikProps}
                      index={i}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>شناسه داشبورد</TableCell>
                        <TableCell>نام داشبورد</TableCell>
                        <TableCell>نمایش در اسلایدشو</TableCell>
                        <TableCell>مدت زمان نمایش (ثانیه)</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.dashboards.map((dashboard, index) => (
                        <DashboardRow
                          dashboard={dashboard}
                          formikProps={formikProps}
                          index={index}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              )
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
        <>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <IconButton onClick={() => setView("LIST")}>
                <ViewListIcon
                  color={view === "LIST" ? "primary" : "disabled"}
                />
              </IconButton>
              <IconButton onClick={() => setView("GRID")}>
                <ViewModuleIcon
                  color={view === "GRID" ? "primary" : "disabled"}
                />
              </IconButton>
            </Grid>
          </Grid>
          <Formik
            initialValues={{
              dashboards: Layout.state.dashboards
            }}
            enableReinitialize={true}
            validate={validate}
            onSubmit={submit}
            render={renderForm}
          />
        </>
      )}
    </Subscribe>
  );
};

export default DashboardSlideConfig;
