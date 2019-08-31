import React, { Component } from "react";
import { saveAs } from "file-saver";
import { withSnackbar } from "notistack";
import moment from "moment-jalaali";
import Chart from "../../../components/Chart/Chart";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import ReportContainer from "../../../containers/Report.container";
import LayoutContainer from "../../../containers/Layout.container";
import MyCustomEvent from "../../../util/customEvent";
import * as mockData from "../../../mockdata";

const processData = ({ cols, rows }) => {
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

class ChartWrapper extends Component {
  data = [{}];

  state = {
    loading: false,
    error: ""
  };

  componentWillMount = () => {
    MyCustomEvent.on("REFRESH_REPORT", this.reload);
    MyCustomEvent.on("SAVE_AS_CSV", this.saveAsCSV);
    MyCustomEvent.on("SAVE_AS_Exlx", this.saveAsExlx);
  };

  componentWillUnmount = () => {
    MyCustomEvent.removeEventListener("REFRESH_REPORT", this.reload);
    MyCustomEvent.removeEventListener("SAVE_AS_CSV", this.saveAsCSV);
    MyCustomEvent.removeEventListener("SAVE_AS_Exlx", this.saveAsExlx);
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.loadData();
  };

  componentDidUpdate = async prevProps => {
    if (this.hasFiltersChanged(prevProps.filters, this.props.filters)) {
      this.hasFilterApplied = true;
      return this.setState({ loading: true, error: "" });
    }

    if (this.hasFilterApplied) {
      await this.loadData();
    }
  };

  hasFiltersChanged = (prevFilters, filters) => {
    if (Object.keys(prevFilters).length !== Object.keys(filters).length) {
      return true;
    }
    for (const key in prevFilters) {
      if (prevFilters.hasOwnProperty(key)) {
        const oldValue = prevFilters[key];
        const curValue = filters[key];
        if (oldValue !== curValue) {
          return true;
        }
      }
    }
    return false;
  };

  loadData = async (useCache = true) => {
    const { editEnabled, instanceId, filters } = this.props;

    if (editEnabled) {
      this.setState({ loading: false });
      this.data = mockData["Charts"];
      return;
    }

    this.hasFilterApplied = false;
    try {
      this.data = await ReportContainer.reportData(
        instanceId,
        filters || [],
        ReportContainer.isDrillDown(instanceId) ? this.getReportParams() : [],
        useCache
      );
      this.data = processData(this.data);
      this.setState({ loading: false, error: "" });
    } catch (error) {
      this.setState({ loading: false, error: "خطای بارگذاری اطلاعات" });
    }
  };

  saveAsCSV = async data => {
    const { instanceId, filters } = this.props;
    if (data !== instanceId) return;
    try {
      const res = await ReportContainer.saveAsCSV(
        instanceId,
        filters || [],
        []
      );
      const blob = new Blob([res], { type: "text/csv" });
      saveAs(
        blob,
        `report-${instanceId}-${moment().format("jYYYY/jMM/jDD")}.csv`
      );
    } catch (error) {
      this.props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    }
  };

  saveAsExlx = async data => {
    const { instanceId, filters } = this.props;
    if (data !== instanceId) return;
    try {
      const res = await ReportContainer.saveAsXlsx(
        instanceId,
        filters || [],
        []
      );
      // const blob = new Blob([res], {
      //   type:
      //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      // });
      saveAs(
        res,
        `report-${instanceId}-${moment().format("jYYYY/jMM/jDD")}.xlsx`
      );
    } catch (error) {
      this.props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    }
  };

  getReportParams = () => {
    const { instanceId, drillDownParamValue } = this.props;
    const userReport = ReportContainer.state.userReports.find(
      ur => ur.id === +instanceId
    );
    const param = userReport.report.query.queryParams.find(
      p => p.fill === "BY_BUSINESS_OR_PARENT"
    );
    param.value = drillDownParamValue;
    return [param];
  };

  handleRetry = async (useCache = false) => {
    this.setState({ loading: true });
    await this.loadData();
  };

  reload = async data => {
    const { instanceId } = this.props;
    const { useCache, loading = false } = data;
    if (instanceId === data.instanceId) {
      this.setState({ loading });
      await this.loadData(useCache);
    }
  };

  chartClickHandler = data => {
    this.props.onClick && this.props.onClick(data);
  };

  render = () => {
    const { loading, error } = this.state;
    const { type, height, dashboardId, instanceId } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error message={error} onRetry={this.handleRetry} />;
    }

    return (
      <Chart
        data={this.data}
        type={type}
        height={height}
        onClick={this.chartClickHandler}
        config={LayoutContainer.getSettings(dashboardId, instanceId)}
      />
    );
  };
}

export default withSnackbar(ChartWrapper);
