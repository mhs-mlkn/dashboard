import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import Chart from "../../../components/Chart/Chart";
import Table from "../../../components/Table/Table";
import Scalar from "../../../components/Scalar/Scalar";
import Loading from "../../../components/Loading/Loading";
import ReportContainer from "../../../containers/Report.container";
import ReportCardActions from "./ReportCardActions";
import Filters from "./Filters";
import * as mockData from "../../../mockdata";

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
  title: {
    fontSize: "1.1rem"
  }
});

const getReport = (report, layout, data) => {
  switch (report.type) {
    case "Table":
      return (
        <Table
          report={report}
          cols={data.cols}
          rows={data.rows}
          count={data.rows.length}
          height={layout.h * 19.5 - 72}
        />
      );

    case "Scalar":
      return <Scalar data={data} />;

    default:
      return <Chart data={data} type={report.type} />;
  }
};

const processData = (reportType, data) => {
  switch (reportType) {
    case "Table":
      return processForTable(data);

    case "Scalar":
      return processForScalar(data);

    default:
      return processForChart(data);
  }
};

const processForTable = data => {
  return data;
};

const processForScalar = ({ cols, rows }) => {
  return [cols[0].key, rows[0].cols[0]];
};

const processForChart = ({ cols, rows }) => {
  let data = [];
  for (const r of rows) {
    const row = r.cols;
    const o = {
      name: row[0]
    };
    for (let index = 1; index < cols.length; index++) {
      const col = cols[index];
      o[col.key] = row[index];
    }
    data.push(o);
  }
  return data;
};

class ReportCard extends Component {
  state = {
    expanded: false,
    filters: "",
    report: undefined,
    loading: false
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const { i: instanceId } = this.props.layout;
    const reportId = ReportContainer.state.reportMap[instanceId];
    const report = await ReportContainer.get(reportId);
    if (this.props.editEnabled) {
      this.data = this.getMockData(report.type);
    } else {
      const data = await ReportContainer.reportData(instanceId);
      this.data = processData(report.type, data);
    }
    this.setState({ loading: false, report });
  };

  getMockData = reportType => {
    if (["Table", "Scalar"].indexOf(reportType) > -1) {
      return mockData[reportType];
    }
    return mockData["Charts"];
  };

  actionHandler = action => {
    if (action === "FILTER") {
      return this.toggleFilters();
    }
    if (action === "SHARE") {
      return this.shareReport();
    }
  };

  toggleFilters = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  shareReport = () => {
    alert("NOT IMPLEMENTED");
  };

  changeFilters = filters => {
    this.setState({ filters });
  };

  render = () => {
    const { expanded, filters, report, loading } = this.state;

    if (!report) {
      return null;
    }

    const { layout, editEnabled, classes } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Card className={classes.card} raised>
        <CardHeader
          action={
            <ReportCardActions
              instanceId={layout.i}
              editEnabled={editEnabled}
              actionHandler={this.actionHandler}
            />
          }
          title={report.name}
          classes={{ title: classes.title }}
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Filters
              report={report}
              values={filters}
              onSubmit={this.changeFilters}
            />
          </CardContent>
        </Collapse>
        <CardContent className={classes.content}>
          {getReport(report, layout, this.data)}
        </CardContent>
      </Card>
    );
  };
}

export default withStyles(styles)(ReportCard);
