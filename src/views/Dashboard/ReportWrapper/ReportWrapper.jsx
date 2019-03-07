import React, { Component } from "react";
import Chart from "../../../components/Chart/Chart";
import Table from "../../../components/Table/Table";
import Scalar from "../../../components/Scalar/Scalar";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import ReportContainer from "../../../containers/Report.container";
import Toolbar from "./Toolbar";

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

class ReportWrapper extends Component {
  report = { type: "" };
  data = [];

  state = {
    loading: true,
    error: ""
  };

  componentDidMount = async () => {
    try {
      this.setState({ loading: true, error: "" });
      const { reportId } = this.props;
      const id = ReportContainer.state.reportMap[reportId];
      this.report = await ReportContainer.get(id);
      const data = await ReportContainer.reportData(reportId);
      this.data = processData(this.report.type, data);
      // console.log(this.data);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error: "خطا در دریافت اطلاعات" });
    }
  };

  getReport = reportType => {
    switch (reportType) {
      case "Table":
        return (
          <Table
            report={this.report}
            cols={this.data.cols}
            rows={this.data.rows}
            count={this.data.totalCount}
          />
        );

      case "Scalar":
        return <Scalar data={this.data} />;

      default:
        return <Chart data={this.data} type={reportType} />;
    }
  };

  render = () => {
    const { reportId, editEnabled } = this.props;
    const { loading, error } = this.state;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <>
          <Toolbar reportId={reportId} visible={editEnabled} />
          <Error message={error} />
        </>
      );
    }

    return (
      <>
        <Toolbar reportId={reportId} visible={editEnabled} />
        {this.getReport(this.report.type)}
      </>
    );
  };
}

export default ReportWrapper;
