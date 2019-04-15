import React, { useState, useEffect } from "react";
import { withSnackbar } from "notistack";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { withRouter } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Refresh from "@material-ui/icons/Refresh";
import FilterList from "@material-ui/icons/FilterList";
import Save from "@material-ui/icons/Save";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Settings from "@material-ui/icons/Settings";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import ReportContainer from "../../../containers/Report.container";
import LayoutContainer from "../../../containers/Layout.container";

const extractReportConfig = report => {
  try {
    const config = JSON.parse(report.config || '{"refreshInterval":0}');
    return config;
  } catch (error) {
    return { refreshInterval: 0 };
  }
};

const ReportCardActions = props => {
  const { editEnabled, userReport, actionHandler } = props;

  const instanceId = userReport.id;
  const hasFilters = userReport.report.query.queryFilters.length > 0;
  const config = extractReportConfig(userReport.report);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isRunning, setIsRunning] = useState(true);

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const shareActionHandler = () => {
  //   actionHandler("SHARE");
  // };

  const refreshActionHandler = () => {
    actionHandler("REFRESH");
  };

  const toggleIntervalHandler = () => {
    setIsRunning(!isRunning);
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
    handleMenuClose();
    domtoimage
      .toBlob(document.getElementById(`report-${instanceId}`))
      .then(function(blob) {
        saveAs(blob, `report-${instanceId}`);
      });
  };

  const backActionHandler = () => {
    actionHandler("BACK");
  };

  useEffect(() => {
    actionHandler("TOGGLE_INTERVAL", isRunning);
  }, [isRunning]);

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
      {!editEnabled && config.refreshInterval > 0 && (
        <IconButton color="primary" onClick={toggleIntervalHandler}>
          {isRunning > 0 ? (
            <Pause fontSize="small" title="توقف بارگذاری خودکار" />
          ) : (
            <PlayArrow fontSize="small" title="شروع بارگذاری خودکار" />
          )}
        </IconButton>
      )}
      {!editEnabled && (
        <IconButton
          color="primary"
          onClick={refreshActionHandler}
          title="بارگذاری مجدد بدون cache"
        >
          <Refresh fontSize="small" />
        </IconButton>
      )}
      {!editEnabled && (
        <>
          <IconButton title="ذخیره" color="primary" onClick={handleMenuClick}>
            <Save fontSize="small" />
          </IconButton>
          <Menu
            id="export-report-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={exportActionHandler}>PNG</MenuItem>
          </Menu>
        </>
        // <IconButton onClick={exportActionHandler}>
        //   <Save color="primary" fontSize="small" />
        // </IconButton>
      )}
      {!editEnabled && hasFilters && (
        <IconButton onClick={filterActionHandler}>
          <FilterList color="primary" fontSize="small" />
        </IconButton>
      )}
      {!editEnabled && ReportContainer.isDrillDown(instanceId) && (
        <IconButton onClick={backActionHandler} title="بازگشت">
          <ArrowUpward color="primary" fontSize="small" />
        </IconButton>
      )}
    </>
  );
};

const WithSnackbar = withSnackbar(ReportCardActions);

export default withRouter(WithSnackbar);
