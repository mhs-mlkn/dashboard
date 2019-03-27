import React from "react";
import { withSnackbar } from "notistack";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { withRouter } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Share from "@material-ui/icons/Share";
import FilterList from "@material-ui/icons/FilterList";
import Save from "@material-ui/icons/Save";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Settings from "@material-ui/icons/Settings";
import ReportContainer from "../../../containers/Report.container";
import LayoutContainer from "../../../containers/Layout.container";

const ReportCardActions = props => {
  const { instanceId, editEnabled, hasFilters, actionHandler } = props;

  const shareActionHandler = () => {
    actionHandler("SHARE");
  };

  const filterActionHandler = () => {
    actionHandler("FILTER");
  };

  const deleteReport = async () => {
    const { index } = props.match.params;
    try {
      await ReportContainer.removeInstance(instanceId);
      await LayoutContainer.removeFromLayout(index, instanceId);
    } catch (error) {
      props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    }
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
            <DeleteForever color="error" fontSize="small" />
          </IconButton>
          <IconButton title="تنظیم" onClick={configReport}>
            <Settings color="primary" fontSize="small" />
          </IconButton>
        </div>
      )}
      {!editEnabled && (
        <IconButton onClick={shareActionHandler}>
          <Share color="secondary" fontSize="small" />
        </IconButton>
      )}
      {!editEnabled && (
        <IconButton onClick={exportActionHandler}>
          <Save color="primary" fontSize="small" />
        </IconButton>
      )}
      {!editEnabled && hasFilters && (
        <IconButton onClick={filterActionHandler}>
          <FilterList color="primary" fontSize="small" />
        </IconButton>
      )}
    </>
  );
};

const WithSnackbar = withSnackbar(ReportCardActions);

export default withRouter(WithSnackbar);
