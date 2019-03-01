import React, { Component } from "react";
import { Subscribe } from "unstated";
import Grid from "@material-ui/core/Grid";
import ReportContainer from "../../../containers/Report.container";
import ReportThumbCard from "./ReportThumbCard";

class ReportList extends Component {
  state = {
    rowsPerPage: 5,
    page: 0,
    loading: false
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    this.loadData();
  };

  componentDidUpdate = (_, preState) => {
    const { page: prePage, rowsPerPage: prePageSize } = preState;
    const { page, rowsPerPage } = this.state;
    if (prePage !== page || prePageSize !== rowsPerPage) {
      this.loadData();
    }
  };

  onChangePage = page => {
    this.setState({ loading: true, page });
  };

  onChangeRowsPerPage = rowsPerPage => {
    this.setState({ loading: true, page: 0, rowsPerPage });
  };

  onAction = async (action, item) => {
    switch (action) {
      case "DELETE":
        await ReportContainer.delete(item.id);
        break;
      case "EDIT":
        await this.props.history.push(`/user/reports/${item.id}/edit`);
        break;
      case "RUN":
        await this.props.history.push(`/user/reports/${item.id}/view`);
        break;

      default:
        break;
    }
  };

  loadData = async () => {
    try {
      const { page, rowsPerPage } = this.state;
      await ReportContainer.getAll(page, rowsPerPage);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  };

  render = () => {
    // const { rowsPerPage, page, loading } = this.state;
    return (
      <Subscribe to={[ReportContainer]}>
        {Reports => (
          <Grid container spacing={16}>
            {Reports.state.reports.map(report => (
              <Grid item key={report.id} xs={12} sm={12} md={3}>
                <ReportThumbCard report={report} />
              </Grid>
            ))}
          </Grid>
        )}
      </Subscribe>
    );
  };
}

export default ReportList;
