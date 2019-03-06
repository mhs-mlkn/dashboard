import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import ReportContainer from "../../../containers/Report.container";
import ReportThumb from "./ReportThumb";
import LoadMore from "./LoadMore";

const PageSize = 8;

class ReportList extends Component {
  state = {
    reports: [],
    totalCount: 0,
    page: 0,
    loading: false
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    this.loadData();
  };

  componentDidUpdate = (_, preState) => {
    const { page: prePage } = preState;
    const { page } = this.state;
    if (prePage !== page) {
      this.loadData();
    }
  };

  onChangePage = () => {
    this.setState(state => ({ loading: true, page: state.page + 1 }));
  };

  loadData = async () => {
    try {
      const { page } = this.state;
      const data = await ReportContainer.getAll(page, PageSize);
      this.setState(state => ({
        reports: state.reports.concat(data.data),
        totalCount: data.totalSize,
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
    const { loading, reports, totalCount } = this.state;
    return (
      <>
        <Grid container spacing={16}>
          {reports.map(report => (
            <Grid item key={report.id} xs={12} sm={6} lg={4} xl={3}>
              <ReportThumb report={report} navigate={this.navigate} />
            </Grid>
          ))}
        </Grid>
        <LoadMore
          loading={loading}
          count={reports.length}
          totalCount={totalCount}
          onLoadMore={this.onChangePage}
        />
      </>
    );
  };
}

export default ReportList;
