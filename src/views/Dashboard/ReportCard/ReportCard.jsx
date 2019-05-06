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

const styles = () => ({
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
    paddingTop: "8px",
    paddingBottom: "8px"
  },
  title: {
    fontSize: "0.9rem"
  }
});

class ReportCard extends Component {
  state = {
    expanded: false,
    filters: "",
    userReport: undefined,
    refreshInterval: 0,
    loading: false,
    error: ""
  };

  componentDidMount = async () => {
    const { i: instanceId } = this.props.layout;
    await this.initial(instanceId);
  };

  componentWillUnmount = () => {
    return clearInterval(this.refreshInterval);
  };

  initial = async instanceId => {
    this.setState({ loading: true });
    const userReport = await ReportContainer.getUserReport(instanceId);
    const { refreshInterval } = this.extractReportConfig(userReport.report);
    this.setState({
      userReport,
      refreshInterval,
      loading: false
    });
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
          MyCustomEvent.emit("REFRESH_REPORT", { instanceId, useCache: true }),
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
        return this.initial(+this.props.layout.i);
      case "SHARE":
        return this.shareReport();
      case "TOGGLE_INTERVAL":
        return this.toggleInterval(data);
      case "CONFIG_REPORT":
        return this.configReport();
      case "SHARE_REPORT":
        return this.configAccess();
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
      MyCustomEvent.emit("CONFIG_REPORT", this.state.userReport);
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
            dashboardIndex={this.props.dashboardIndex}
            filters={this.state.filters}
            editEnabled={this.props.editEnabled}
            height={height * 10}
          />
        );

      default:
        return (
          <ChartWrapper
            instanceId={instanceId}
            dashboardIndex={this.props.dashboardIndex}
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

    if (!userReport) {
      return null;
    }

    const { layout, editEnabled, classes } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error message={error} />;
    }

    return (
      <Card className={classes.card} raised>
        <CardHeader
          action={
            <ReportCardActions
              userReport={userReport}
              editEnabled={editEnabled}
              actionHandler={this.actionHandler}
            />
          }
          title={userReport.name || userReport.report.name}
          classes={{ root: classes.headerRoot, title: classes.title }}
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Filters
              report={userReport.report}
              values={filters}
              onSubmit={this.changeFilters}
            />
          </CardContent>
        </Collapse>
        <CardContent className={classes.content} id={`report-${layout.i}`}>
          {this.getReport(userReport.report.type, layout)}
        </CardContent>
      </Card>
    );
  };
}

export default withStyles(styles)(ReportCard);
