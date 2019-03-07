import React, { Component } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { withStyles } from "@material-ui/core/styles";
import { withSize } from "react-sizeme";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import FilterList from "@material-ui/icons/FilterList";
import Share from "@material-ui/icons/Share";
// import { unstable_Box as Box } from "@material-ui/core/Box";
import TableActions from "./TableActions";
import Filters from "./Filters";

const styles = theme => {
  return {
    root: {
      width: "100%",
      overflow: "auto"
      // marginTop: theme.spacing.unit * 3
      // minWidth: 400,
    },
    table: {},
    header: {
      backgroundColor: "#4c4b4b"
    },
    nowrap: {
      whiteSpace: "nowrap"
    },
    filters: {
      width: "100%",
      padding: theme.spacing.unit * 2
    }
  };
};

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.grey["800"],
    fontSize: "11px"
  }
}))(TableCell);

class CustomTable extends Component {
  state = {
    expanded: false,
    filters: ""
  };

  componentDidMount = () => {
    this.ps = new PerfectScrollbar(this.refs.tableWrapper);
  };

  handleExpandClick = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  changeFilters = filters => {
    this.setState({ filters });
  };

  handleChangePage = (_, page) => {
    this.props.handleChangePage && this.props.onChangePage(page);
  };

  handleChangeRowsPerPage = event => {
    this.props.onChangeRowsPerPage &&
      this.props.onChangeRowsPerPage(+event.target.value);
  };

  handleAction = (action, item) => {
    this.props.onAction && this.props.onAction(action, item);
  };

  render() {
    const {
      report,
      cols,
      rows,
      count,
      rowsPerPage = 10,
      page = 0,
      loading,
      aspect = 0,
      classes
    } = this.props;

    const { expanded, filters } = this.state;

    const { width } = this.props.size;

    const { queryFilters } = report.query;
    const showFilters = queryFilters.length > 0;

    const emptyRows = 0;
    // rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

    const tableStyle = {
      height: aspect ? width / aspect : "100%"
    };

    const colSpan = cols.length;

    return (
      <div
        id="table-wrapper"
        className={classes.root}
        style={tableStyle}
        ref="tableWrapper"
      >
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={colSpan - 1}
                align="left"
                className={classes.header}
              >
                <Typography component="div" variant="body1">
                  {report.name}
                </Typography>
              </TableCell>
              <TableCell align="right" className={classes.header}>
                <IconButton>
                  <Share color="secondary" />
                </IconButton>
                {showFilters && (
                  <IconButton onClick={this.handleExpandClick}>
                    <FilterList color="primary" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
            {showFilters && (
              <Collapse
                in={expanded}
                timeout="auto"
                unmountOnExit
                className={classes.filters}
              >
                <div className={classes.filters}>
                  <Filters
                    report={report}
                    values={filters}
                    onSubmit={this.changeFilters}
                  />
                </div>
              </Collapse>
            )}
            <TableRow>
              {cols.map((col, key) => (
                <CustomTableCell key={key}>{col.key}</CustomTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              (rows.length > rowsPerPage
                ? rows.slice(0, rowsPerPage)
                : rows
              ).map(({ cols: cells }, key) => (
                <TableRow hover key={key}>
                  {cells.map((cell, i) => (
                    <TableCell key={i}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  داده ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
            {rows.length > 0 && emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={colSpan} />
              </TableRow>
            )}
          </TableBody>
          {rows.length > 0 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={colSpan}
                  count={count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    native: true
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  labelRowsPerPage="تعداد در صفحه"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} از ${count}`
                  }
                  ActionsComponent={TableActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    );
  }
}

const WithSize = withSize()(CustomTable);

export default withStyles(styles)(WithSize);
