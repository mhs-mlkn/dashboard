import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableActions from "./TableActions";
import { get } from "lodash";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  nowrap: {
    whiteSpace: "nowrap"
  }
});

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.grey["800"],
    fontSize: "11px"
  }
}))(TableCell);

class CustomTable extends Component {
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
      cols,
      rows,
      count,
      rowsPerPage = 10,
      page = 0,
      loading,
      ActionsComponent,
      classes
    } = this.props;

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

    return (
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {cols.map((col, key) => (
              <CustomTableCell key={key}>{col.title}</CustomTableCell>
            ))}
            {rows.length > 0 && ActionsComponent && <CustomTableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={cols.length} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : rows.length ? (
            rows.map((row, key) => (
              <TableRow hover key={key}>
                {cols.map((col, key) => (
                  <TableCell key={key}>{get(row, col.path)}</TableCell>
                ))}
                {ActionsComponent && (
                  <TableCell align="right" className={classes.nowrap}>
                    <ActionsComponent
                      onAction={action => this.handleAction(action, row)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={cols.length}>
                داده ای برای نمایش وجود ندارد
              </TableCell>
            </TableRow>
          )}
          {rows.length > 0 && emptyRows > 0 && (
            <TableRow style={{ height: 48 * emptyRows }}>
              <TableCell colSpan={cols.length} />
            </TableRow>
          )}
        </TableBody>
        {rows.length > 0 && (
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                colSpan={ActionsComponent ? cols.length + 1 : cols.length}
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
    );
  }
}

export default withStyles(styles)(CustomTable);
