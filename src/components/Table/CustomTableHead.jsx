import React from "react";
import { withStyles } from "@material-ui/core/styles";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.grey["800"],
    fontSize: "11px"
  }
}))(TableCell);

const CustomTableHead = props => {
  const { cols = [], orderBy = "تاریخ", order = "asc", onSort } = props;

  const sortHandler = orderBy => () => onSort(orderBy);

  return (
    <TableHead>
      <TableRow>
        {cols.map((col, key) => (
          <CustomTableCell
            key={key}
            sortDirection={orderBy === col.key ? order : false}
          >
            <TableSortLabel
              active={orderBy === col.key}
              direction={order || "desc"}
              onClick={sortHandler(col.key)}
            >
              {col.key}
            </TableSortLabel>
          </CustomTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default CustomTableHead;
