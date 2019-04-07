import React, { Component } from "react";
import Table from "../../../components/Table/Table";
import Error from "../../../components/Error/Error";
import ReportContainer from "../../../containers/Report.container";
import * as mockData from "../../../mockdata";
import MyCustomEvent from "../../../util/customEvent";

class TableWrapper extends Component {
  data = {
    cols: [],
    rows: []
  };

  totalCount = 0;

  state = {
    page: 0,
    pageSize: 10,
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

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.hasFiltersChanged(prevProps.filters, this.props.filters)) {
      this.hasFilterApplied = true;
      return this.setState({ error: "", loading: true, page: 0 });
    }

    const { pageSize, page } = this.state;
    const { pageSize: prevPageSize, page: prevCurrentPage } = prevState;
    if (
      this.hasFilterApplied ||
      prevPageSize !== pageSize ||
      prevCurrentPage !== page
    ) {
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

  loadData = async (useCache = false) => {
    const { pageSize, page } = this.state;
    const { editEnabled, instanceId, filters } = this.props;

    if (editEnabled) {
      this.setState({ loading: false });
      this.data = mockData["Table"];
      this.totalCount = this.data.rows.length;
      return;
    }

    this.hasFilterApplied = false;
    try {
      this.data = await ReportContainer.reportData(
        instanceId,
        filters || [],
        [],
        useCache,
        page,
        pageSize
      );
      this.totalCount = this.getTotalCount(this.data);
      this.setState({ loading: false, error: "" });
    } catch (error) {
      this.setState({ loading: false, error: "خطای بارگذاری اطلاعات" });
    }
  };

  getTotalCount = ({ totalCount }) => {
    const { page } = this.state;
    if (page === 0) {
      return totalCount;
    }
    return this.totalCount;
  };

  handleChangePage = page => {
    this.setState({
      error: "",
      loading: true,
      page
    });
  };

  handleChangePageSize = pageSize => {
    const { page: currentPage } = this.state;
    const totalPages = Math.ceil(this.totalCount / pageSize);
    const page = Math.min(currentPage, totalPages - 1);

    this.setState({
      error: "",
      loading: true,
      pageSize,
      page
    });
  };

  handleRetry = async () => {
    this.setState({ loading: true });
    await this.loadData();
  };

  reload = async clickedId => {
    const { instanceId } = this.props;
    if (instanceId === clickedId) {
      this.setState({ loading: true });
      await this.loadData(true);
    }
  };

  render = () => {
    const { page, pageSize, loading, error } = this.state;
    const { height } = this.props;

    if (error) {
      return <Error message={error} onRetry={this.handleRetry} />;
    }

    return (
      <Table
        cols={this.data.cols}
        rows={this.data.rows}
        count={this.totalCount}
        page={page}
        rowsPerPage={pageSize}
        loading={loading}
        height={height}
        onChangePageSize={this.handleChangePageSize}
        onChangePage={this.handleChangePage}
      />
    );
  };
}

export default TableWrapper;
