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
import GroupAdd from "@material-ui/icons/GroupAdd";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
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
  const [open, setOpen] = useState(false);
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

  const toggleConfirm = () => {
    setOpen(!open);
  };

  const deleteReport = async () => {
    const { index } = props.match.params;
    try {
      await ReportContainer.removeInstance(instanceId);
      await LayoutContainer.removeFromLayout(index, instanceId);
      props.enqueueSnackbar("با موفقیت حذف شد", {
        variant: "success"
      });
    } catch (error) {
      props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    }
  };

  const configReport = () => {
    actionHandler("CONFIG_REPORT");
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

  const addUserActionHandler = () => {
    actionHandler("MANAGE_ACCESS");
  };

  useEffect(() => {
    actionHandler("TOGGLE_INTERVAL", isRunning);
  }, [isRunning]);

  return (
    <div style={{ zIndex: "100000" }}>
      <ConfirmDialog
        title="آیا اطمینان دارید؟"
        handleConfirm={deleteReport}
        handleClose={toggleConfirm}
        open={open}
      />
      {editEnabled && (
        <div className="draggableCancel">
          <IconButton title="دسترسی" onClick={addUserActionHandler}>
            <GroupAdd color="secondary" fontSize="small" />
          </IconButton>
          <IconButton title="حذف" onClick={toggleConfirm}>
            <DeleteForever color="error" fontSize="small" />
          </IconButton>
          <IconButton title="تنظیم" onClick={configReport}>
            <Settings color="primary" fontSize="small" />
          </IconButton>
        </div>
      )}
      {!editEnabled && config.refreshInterval > 0 && (
        <IconButton
          color="primary"
          onClick={toggleIntervalHandler}
          title={isRunning ? "توقف بارگذاری خودکار" : "شروع بارگذاری خودکار"}
        >
          {isRunning ? (
            <Pause fontSize="small" />
          ) : (
            <PlayArrow fontSize="small" />
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
      )}
      {!editEnabled && hasFilters && userReport.report.type === "Table" && (
        <IconButton onClick={filterActionHandler}>
          <FilterList color="primary" fontSize="small" />
        </IconButton>
      )}
      {!editEnabled && ReportContainer.isDrillDown(instanceId) && (
        <IconButton onClick={backActionHandler} title="بازگشت">
          <ArrowUpward color="primary" fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

const WithSnackbar = withSnackbar(ReportCardActions);

export default withRouter(WithSnackbar);
