import React, { Component } from "react";
import Scalar from "../../../components/Scalar/Scalar";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import ReportContainer from "../../../containers/Report.container";
import LayoutContainer from "../../../containers/Layout.container";
import * as mockData from "../../../mockdata";
import MyCustomEvent from "../../../util/customEvent";

const processData = ({ cols, rows }) => {
  return [cols[0].key, rows[0].cols[0]];
};

class ScalarWrapper extends Component {
  data = ["", 0];

  state = {
    loading: false,
    error: ""
  };

  componentWillMount = () => {
    MyCustomEvent.on("REFRESH_REPORT", this.reload);
  };

  componentWillUnmount = () => {
    MyCustomEvent.removeEventListener("REFRESH_REPORT", this.reload);
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
      this.data = mockData["Scalar"];
      return;
    }

    this.hasFilterApplied = false;
    try {
      this.data = await ReportContainer.reportData(
        instanceId,
        filters || [],
        [],
        useCache
      );
      this.data = processData(this.data);
      this.setState({ loading: false, error: "" });
    } catch (error) {
      this.setState({ loading: false, error: "خطای بارگذاری اطلاعات" });
    }
  };

  handleRetry = async () => {
    this.setState({ loading: true });
    await this.loadData();
  };

  reload = async data => {
    const { instanceId } = this.props;
    if (instanceId === data.instanceId) {
      this.setState({ loading: true });
      await this.loadData(data.useCache);
    }
  };

  render = () => {
    const { loading, error } = this.state;
    const { instanceId, dashboardId, height } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error message={error} onRetry={this.handleRetry} />;
    }

    return (
      <Scalar
        data={this.data}
        height={height}
        config={LayoutContainer.getSettings(dashboardId, instanceId)}
      />
    );
  };
}

export default ScalarWrapper;
