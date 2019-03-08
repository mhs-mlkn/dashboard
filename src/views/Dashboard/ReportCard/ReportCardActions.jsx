import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Share from "@material-ui/icons/Share";
import FilterList from "@material-ui/icons/FilterList";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Settings from "@material-ui/icons/Settings";
import ReportContainer from "../../../containers/Report.container";

const ReportCardActions = props => {
  const { instanceId, editEnabled, actionHandler } = props;

  const shareActionHandler = () => {
    actionHandler("SHARE");
  };

  const filteActionHandler = () => {
    actionHandler("FILTER");
  };

  const deleteReport = async () => {
    await ReportContainer.removeReport(instanceId);
    await ReportContainer.removeFromLayout(instanceId);
  };

  const configReport = () => {
    alert("NOT IMPLEMENTED");
  };

  return (
    <>
      {editEnabled && (
        <div>
          <IconButton title="حذف" onClick={deleteReport}>
            <DeleteForever color="error" />
          </IconButton>
          <IconButton title="تنظیم" onClick={configReport}>
            <Settings color="primary" />
          </IconButton>
        </div>
      )}
      {!editEnabled && (
        <div>
          <IconButton onClick={shareActionHandler}>
            <Share color="secondary" />
          </IconButton>
          <IconButton onClick={filteActionHandler}>
            <FilterList color="primary" />
          </IconButton>
        </div>
      )}
    </>
  );
};

export default ReportCardActions;
