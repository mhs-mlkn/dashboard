import React, { Component } from "react";
import { Subscribe } from "unstated";
import Grid from "@material-ui/core/Grid";
import ReportContainer from "../../../containers/Report.container";
import ReportThumb from "./ReportThumb";
import LoadMore from "./LoadMore";
import Search from "./Search";

const PageSize = 12;

class ReportList extends Component {
  state = {
    page: 0,
    query: "",
    loading: false
  };

  hasSearched = false;
  tempState = { reports: [], totalCount: 0 };

  componentDidUpdate = (_, preState) => {
    const { page: prePage, query: preQuery } = preState;
    const { page, query } = this.state;
    if (!preQuery && !!query) {
      this.hasSearched = true;
      this.tempState = {
        reports: [...ReportContainer.state.reports],
        totalCount: ReportContainer.state.totalCount
      };
    }
    if (!preQuery && !query && this.state.loading) {
      this.setState({ loading: false });
    }
    if (prePage !== page || query !== preQuery) {
      this.loadData();
    }
  };

  componentWillUnmount = () => {
    if (this.hasSearched) {
      ReportContainer.retrieveState(this.tempState);
    }
  };

  onChangePage = () => {
    this.setState(state => ({ loading: true, page: state.page + 1 }));
  };

  handleSearchClicked = query => {
    this.setState({ loading: true, page: 0, query });
  };

  loadData = async () => {
    try {
      const { page, query } = this.state;
      await ReportContainer.getAll(page, PageSize, query);
      this.setState(state => ({
        loading: false
      }));
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  };

  navigate = path => {
    this.props.history.push(path);
  };

  render = () => {
    const { loading } = this.state;
    return (
      <Subscribe to={[ReportContainer]}>
        {Report => (
          <>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <Search onSearch={this.handleSearchClicked} />
              </Grid>
            </Grid>
            <Grid container spacing={8}>
              {Report.state.reports.map(report => (
                <Grid item key={report.id} xs={12} sm={6} lg={4} xl={3}>
                  <ReportThumb report={report} navigate={this.navigate} />
                </Grid>
              ))}
            </Grid>
            <LoadMore
              loading={loading}
              count={Report.state.reports.length}
              totalCount={Report.state.totalCount}
              onLoadMore={this.onChangePage}
            />
          </>
        )}
      </Subscribe>
    );
  };
}

export default ReportList;
