import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Settings from "@material-ui/icons/Settings";
import DeleteForever from "@material-ui/icons/DeleteForever";
import ReportContainer from "../../../containers/Report.container";

const styles = () => ({
  root: {
    position: "absolute",
    minWidth: "100px",
    left: "10px",
    zIndex: "10000"
  }
});

const Toolbar = props => {
  const { reportId, visible, classes } = props;

  const deleteReport = async () => {
    await ReportContainer.removeReport(reportId);
    await ReportContainer.removeFromLayout(reportId);
  };

  if (!visible) {
    return null;
  }
  return (
    <div className={classes.root}>
      <IconButton size="small" title="حذف" onClick={deleteReport}>
        <DeleteForever color="error" />
      </IconButton>
      <IconButton
        size="small"
        title="تنظیم"
        onClick={() => alert("NOT IMPLEMENTED YET")}
      >
        <Settings color="primary" />
      </IconButton>
    </div>
  );
};

export default withStyles(styles)(Toolbar);
