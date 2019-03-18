import React from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import IconButton from "@material-ui/core/IconButton";
import Share from "@material-ui/icons/Share";
import FilterList from "@material-ui/icons/FilterList";
import Save from "@material-ui/icons/Save";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Settings from "@material-ui/icons/Settings";
import ReportContainer from "../../../containers/Report.container";

const ReportCardActions = props => {
  const { instanceId, editEnabled, hasFilters, actionHandler } = props;

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

  const exportActionHandler = () => {
    domtoimage
      .toBlob(document.getElementById(`report-${instanceId}`))
      .then(function(blob) {
        saveAs(blob, `report-${instanceId}`);
      });
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
        <IconButton onClick={shareActionHandler}>
          <Share color="secondary" />
        </IconButton>
      )}
      {!editEnabled && (
        <IconButton onClick={exportActionHandler}>
          <Save color="primary" />
        </IconButton>
      )}
      {!editEnabled && hasFilters && (
        <IconButton onClick={filteActionHandler}>
          <FilterList color="primary" />
        </IconButton>
      )}
    </>
  );
};

export default ReportCardActions;
