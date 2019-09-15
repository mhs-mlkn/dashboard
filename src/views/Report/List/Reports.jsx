import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ViewListIcon from "@material-ui/icons/ViewList";
import Loading from "../../../components/Loading/Loading";
import ReportContainer from "../../../containers/Report.container";
import Search from "./Search";
import GridView from "./GridView";
import ListView from "./ListView";

const PageSize = 12;
const VIEW = "REPORTS_VIEW";

class ReportList extends Component {
  state = {
    page: 0,
    pageSize: 10,
    query: "",
    loading: false,
    view: localStorage.getItem(VIEW) || "GRID"
  };

  hasSearched = false;
  tempState = { reports: [], totalCount: 0 };

  setView = () => {
    const { view } = this.state;
    const updatedView = view === "GRID" ? "LIST" : "GRID";
    localStorage.setItem(VIEW, updatedView);
    this.setState({ view: updatedView });
  };

  componentDidUpdate = (_, preState) => {
    const { page: prePage, pageSize: prePageSize, query: preQuery } = preState;
    const { page, pageSize, query } = this.state;
    if (!preQuery && !!query) {
      this.hasSearched = true;
      this.tempState = {
        reports: [...ReportContainer.state.reports],
        totalCount: ReportContainer.state.totalCount
      };
    }
    // if (!preQuery && !query && this.state.loading) {
    //   this.setState({ loading: false });
    // }
    if (prePage !== page || prePageSize !== pageSize || query !== preQuery) {
      this.loadData();
    }
  };

  componentWillUnmount = () => {
    if (this.hasSearched) {
      ReportContainer.retrieveState(this.tempState);
    }
  };

  handleChangePage = page => {
    this.setState({ loading: true, page });
  };

  handleChangePageSize = pageSize => {
    this.setState({ loading: true, page: 0, pageSize });
  };

  handleSearchClicked = query => {
    this.setState({ loading: true, page: 0, query });
  };

  loadData = async () => {
    try {
      const { view, page, pageSize, query } = this.state;
      await ReportContainer.getAll(
        page,
        view === "GRID" ? PageSize : pageSize,
        query
      );
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  };

  navigate = path => {
    this.props.history.push(path);
  };

  render = () => {
    const { loading, page, pageSize, view, query } = this.state;
    return (
      <>
        <Grid container spacing={8} style={{ marginBottom: 8 }}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Search onSearch={this.handleSearchClicked} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={9}>
            <IconButton onClick={this.setView}>
              <ViewListIcon color={view === "LIST" ? "primary" : "disabled"} />
            </IconButton>
            <IconButton onClick={this.setView}>
              <ViewModuleIcon
                color={view === "GRID" ? "primary" : "disabled"}
              />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container spacing={8}>
          {loading ? (
            <Loading />
          ) : ReportContainer.state.reports.length === 0 && query ? (
            "داده ای برای جستجوی شما یافت نشد"
          ) : view === "GRID" ? (
            <GridView
              loading={loading}
              page={page}
              onChangePage={this.handleChangePage}
              navigate={this.navigate}
            />
          ) : (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <ListView
                loading={loading}
                page={page}
                pageSize={pageSize}
                onChangePage={this.handleChangePage}
                onChangePageSize={this.handleChangePageSize}
                navigate={this.navigate}
              />
            </Grid>
          )}
        </Grid>
      </>
    );
  };
}

export default ReportList;
