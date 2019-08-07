import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import TableWrapper from "./TableWrapper";
import ScalarWrapper from "./ScalarWrapper";
import ChartWrapper from "./ChartWrapper";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import ReportCardActions from "./ReportCardActions";
import ReportContainer from "../../../containers/Report.container";
import Filters from "./Filters";
import MyCustomEvent from "../../../util/customEvent";

const styles = {
  card: {
    height: "100%",
    backgroundColor: "transparent"
    // overflow: "auto"
  },
  content: {
    padding: "0",
    "&:last-child": {
      padding: "0"
    }
  },
  headerRoot: {
    paddingTop: 8,
    paddingBottom: 8
  },
  title: {
    fontSize: "0.9rem"
  }
};

class ReportCard extends Component {
  state = {
    expanded: false,
    filters: "",
    userReport: undefined,
    refreshInterval: 0,
    loading: false,
    error: ""
  };

  componentDidCatch(error, info) {
    console.dir(info);
    this.setState({ error: "خطای ارتباط با پایگاه داده" });
  }

  componentDidMount = async () => {
    const { i: instanceId } = this.props.layout;
    await this.initial(instanceId);
  };

  componentWillUnmount = () => {
    return clearInterval(this.refreshInterval);
  };

  initial = async instanceId => {
    this.setState({ loading: true });
    try {
      const userReport = await ReportContainer.getUserReport(instanceId);
      const { refreshInterval } = this.extractReportConfig(userReport.report);
      this.setState({
        userReport,
        refreshInterval,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false
      });
    }
  };

  extractReportConfig = report => {
    try {
      const config = JSON.parse(report.config || '{"refreshInterval":0}');
      return config;
    } catch (error) {
      return { refreshInterval: 0 };
    }
  };

  setRefreshInterval = () => {
    const { refreshInterval } = this.state;
    const { editEnabled } = this.props;

    if (!editEnabled && refreshInterval > 0) {
      const { id: instanceId } = this.state.userReport;
      this.refreshInterval = setInterval(
        () =>
          MyCustomEvent.emit("REFRESH_REPORT", { instanceId, useCache: false }),
        refreshInterval * 1000
      );
    }
  };

  actionHandler = (action, data) => {
    switch (action) {
      case "FILTER":
        return this.toggleFilters();
      case "REFRESH":
        return this.refreshReport();
      case "BACK":
        clearInterval(this.refreshInterval);
        return this.initial(+this.props.layout.i);
      case "SHARE":
        return this.shareReport();
      case "TOGGLE_INTERVAL":
        return this.toggleInterval(data);
      case "CONFIG_REPORT":
        return this.configReport();
      case "SHARE_REPORT":
        return this.configAccess();
      case "SAVE_AS_CSV":
        return MyCustomEvent.emit("SAVE_AS_CSV", +this.props.layout.i);
      case "SAVE_AS_Exlx":
        return MyCustomEvent.emit("SAVE_AS_Exlx", +this.props.layout.i);
      case "REPORT_DELETED":
        return this.onReportDeleted();
      default:
        break;
    }
  };

  onReportDeleted = () => {
    MyCustomEvent.emit("REPORT_DELETED");
  };

  toggleFilters = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  refreshReport = () => {
    const { id: instanceId } = this.state.userReport;
    MyCustomEvent.emit("REFRESH_REPORT", { instanceId, useCache: false });
  };

  configReport = () => {
    if (["Table"].indexOf(this.state.userReport.report.type) < 0) {
      const { dashboardId } = this.props;
      const { userReport } = this.state;
      MyCustomEvent.emit("CONFIG_REPORT", { userReport, dashboardId });
    }
  };

  configAccess = () => {
    MyCustomEvent.emit("SHARE_REPORT", this.state.userReport.report.id);
  };

  toggleInterval = isRunning => {
    if (!isRunning) {
      return clearInterval(this.refreshInterval);
    }
    this.setRefreshInterval();
  };

  shareReport = () => {
    alert("NOT IMPLEMENTED");
  };

  changeFilters = filters => {
    this.setState({ expanded: false, filters });
  };

  chartClickHandler = async data => {
    this.drillDownParamValue = data.name;
    const { userReport } = this.state;
    if (userReport.report.drillDownId > -1) {
      await this.initial(userReport.drillDownId);
    }
  };

  getReport = (reportType, layout) => {
    const height = layout.h * 19.5 - 72;
    const { id: instanceId } = this.state.userReport;
    switch (reportType) {
      case "Table":
        return (
          <TableWrapper
            instanceId={instanceId}
            filters={this.state.filters}
            editEnabled={this.props.editEnabled}
            height={height}
          />
        );

      case "Scalar":
        return (
          <ScalarWrapper
            instanceId={instanceId}
            dashboardId={this.props.dashboardId}
            filters={this.state.filters}
            editEnabled={this.props.editEnabled}
            height={height * 1.1}
          />
        );

      default:
        return (
          <ChartWrapper
            instanceId={instanceId}
            dashboardId={this.props.dashboardId}
            type={reportType}
            filters={this.state.filters}
            editEnabled={this.props.editEnabled}
            height={height}
            drillDownParamValue={this.drillDownParamValue}
            onClick={this.chartClickHandler}
          />
        );
    }
  };

  render = () => {
    const { expanded, filters, userReport, loading, error } = this.state;
    const { layout, editEnabled, classes } = this.props;
    const reportHeight = layout.h * 19.5 - 72;

    if (loading) {
      return <Loading />;
    }

    if (error && !editEnabled) {
      return (
        <Card className={classes.card}>
          <CardContent>
            <Error message={error} />
          </CardContent>
        </Card>
      );
    }

    if (error && editEnabled) {
      return (
        <Card className={classes.card}>
          <CardHeader
            action={
              <ReportCardActions
                userReport={undefined}
                instanceId={+layout.i}
                reportHeight={reportHeight}
                editEnabled={editEnabled}
                actionHandler={this.actionHandler}
              />
            }
            title=""
            classes={{ root: classes.headerRoot, title: classes.title }}
          />
          <CardContent>
            <Error message={error} />
          </CardContent>
        </Card>
      );
    }

    if (!error && !userReport) {
      return null;
    }

    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <ReportCardActions
              userReport={userReport}
              instanceId={+userReport.id}
              reportHeight={
                userReport.report.type === "Scalar"
                  ? reportHeight * 1.1
                  : reportHeight
              }
              editEnabled={editEnabled}
              actionHandler={this.actionHandler}
            />
          }
          title={userReport && (userReport.name || userReport.report.name)}
          classes={{ root: classes.headerRoot, title: classes.title }}
        />
        {userReport && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Filters
                report={userReport.report}
                values={filters}
                onSubmit={this.changeFilters}
              />
            </CardContent>
          </Collapse>
        )}
        <CardContent className={classes.content} id={`report-${layout.i}`}>
          {error ? (
            <Error message={error} />
          ) : (
            this.getReport(userReport.report.type, layout)
          )}
        </CardContent>
      </Card>
    );
  };
}

export default withStyles(styles)(ReportCard);
