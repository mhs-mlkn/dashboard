import React from "react";
import moment from "moment-jalaali";
import { Subscribe } from "unstated";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import ReportContainer from "../../../containers/Report.container";
import DashboardMenu from "./DashboardMenu";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          title="صفحه اول"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          title="صفحه قبل"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          title="صفحه بعد"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          title="صفحه آخر"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

class ListView extends React.Component {
  handleChangePage = (event, page) => {
    this.props.onChangePage(page);
  };

  handleChangePageSize = event => {
    this.props.onChangePageSize(+event.target.value);
  };

  render() {
    const { pageSize, page, loading, navigate } = this.props;

    return (
      <Subscribe to={[ReportContainer]}>
        {Report => (
          <Table>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell color={4}>Loading ...</TableCell>
                </TableRow>
              ) : (
                Report.state.reports.map(report => (
                  <TableRow key={report.id}>
                    <TableCell component="th" scope="row">
                      {report.name}
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      {moment(
                        report.created.slice(0, report.created.length - 6)
                      ).format("LL")}
                    </TableCell>
                    <TableCell align="right">
                      <DashboardMenu reportId={report.id} navigate={navigate} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={4}
                  count={Report.state.totalCount}
                  rowsPerPage={pageSize}
                  page={page}
                  SelectProps={{
                    native: true
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangePageSize}
                  labelRowsPerPage="تعداد در صفحه"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} از ${count}`
                  }
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </Subscribe>
    );
  }
}

export default ListView;
