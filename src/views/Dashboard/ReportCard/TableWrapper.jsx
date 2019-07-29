import React, { Component } from "react";
import { saveAs } from "file-saver";
import { withSnackbar } from "notistack";
import moment from "moment-jalaali";
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
    orderBy: "",
    order: "",
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

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.hasFiltersChanged(prevProps.filters, this.props.filters)) {
      this.hasFilterApplied = true;
      return this.setState({ error: "", loading: true, page: 0 });
    }

    const { pageSize, page, orderBy, order } = this.state;
    const {
      pageSize: prevPageSize,
      page: prevCurrentPage,
      orderBy: prevOrderBy,
      order: prevOrder
    } = prevState;

    if (
      this.hasFilterApplied ||
      prevPageSize !== pageSize ||
      prevCurrentPage !== page ||
      prevOrderBy !== orderBy ||
      prevOrder !== order
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

  loadData = async (useCache = true) => {
    const { pageSize, page, orderBy, order } = this.state;
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
        pageSize,
        orderBy,
        order
      );
      this.totalCount = this.getTotalCount(this.data);
      this.setState({ loading: false, error: "" });
    } catch (error) {
      this.setState({ loading: false, error: "خطای بارگذاری اطلاعات" });
    }
  };

  saveAsCSV = async data => {
    const { orderBy, order } = this.state;
    const { instanceId, filters } = this.props;
    if (data !== instanceId) return;
    try {
      const res = await ReportContainer.saveAsCSV(
        instanceId,
        filters || [],
        [],
        orderBy,
        order
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
    const { orderBy, order } = this.state;
    const { instanceId, filters } = this.props;
    if (data !== instanceId) return;
    try {
      const res = await ReportContainer.saveAsXlsx(
        instanceId,
        filters || [],
        [],
        orderBy,
        order
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

  handleSort = col => {
    const { orderBy, order } = this.state;
    if (orderBy !== col) {
      return this.setState({
        error: "",
        loading: true,
        orderBy: col,
        order: "desc"
      });
    } else if (orderBy === col && order === "desc") {
      return this.setState({ error: "", loading: true, order: "asc" });
    }
    return this.setState({ error: "", loading: true, orderBy: "", order: "" });
  };

  handleRetry = async () => {
    this.setState({ loading: true });
    await this.loadData();
  };

  reload = async data => {
    const { instanceId } = this.props;
    if (instanceId === data.instanceId) {
      // this.setState({ loading: true });
      await this.loadData(data.useCache);
    }
  };

  render = () => {
    const { page, pageSize, orderBy, order, loading, error } = this.state;
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
        orderBy={orderBy}
        order={order}
        rowsPerPage={pageSize}
        loading={loading}
        height={height}
        onChangePageSize={this.handleChangePageSize}
        onChangePage={this.handleChangePage}
        onSort={this.handleSort}
      />
    );
  };
}

export default withSnackbar(TableWrapper);
