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
import Code from "@material-ui/icons/Code";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import Dialog from "../../../components/Dialog/Dialog";
import ReportContainer from "../../../containers/Report.container";
import LayoutContainer from "../../../containers/Layout.container";
import EmbedReport from "./Embed";

const extractReportConfig = userReport => {
  if (!userReport) {
    return;
  }
  const { report } = userReport;
  try {
    const config = JSON.parse(report.config || '{"refreshInterval":0}');
    return config;
  } catch (error) {
    return { refreshInterval: 0 };
  }
};

const ReportCardActions = props => {
  const {
    editEnabled,
    instanceId,
    userReport,
    reportHeight,
    actionHandler
  } = props;

  const hasFilters = userReport
    ? userReport.report.query.queryFilters.length > 0
    : false;
  const config = extractReportConfig(userReport);

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [embedModal, setEmbedModal] = useState(false);
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
    const { dashboardId } = props.match.params;
    try {
      await ReportContainer.removeInstance(instanceId);
      await LayoutContainer.removeFromLayout(dashboardId, instanceId);
      actionHandler("REPORT_DELETED");
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
    actionHandler("SHARE_REPORT");
  };

  const embedReportHandler = () => {
    setEmbedModal(!embedModal);
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
      <Dialog
        title="گزارش را در صفحه خود ببینید"
        open={embedModal}
        onClose={embedReportHandler}
      >
        <EmbedReport instanceId={instanceId} />
      </Dialog>
      {editEnabled && (
        <div className="draggableCancel">
          {userReport && !userReport.report.publicized && (
            <IconButton title="دسترسی" onClick={addUserActionHandler}>
              <GroupAdd color="secondary" fontSize="small" />
            </IconButton>
          )}
          <IconButton title="حذف" onClick={toggleConfirm}>
            <DeleteForever color="error" fontSize="small" />
          </IconButton>
          {userReport && userReport.report.type !== "Table" && (
            <IconButton title="تنظیم" onClick={configReport}>
              <Settings color="primary" fontSize="small" />
            </IconButton>
          )}
        </div>
      )}
      {userReport && !editEnabled && config.refreshInterval > 0 && (
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
      {userReport && !editEnabled && (
        <IconButton
          color="primary"
          onClick={refreshActionHandler}
          title="بارگذاری مجدد بدون cache"
        >
          <Refresh fontSize="small" />
        </IconButton>
      )}
      {userReport && !editEnabled && (
        <>
          <IconButton
            title={reportHeight > 150 ? "ارتفاع گزارش کم است" : "ذخیره"}
            color="primary"
            onClick={handleMenuClick}
            disabled={reportHeight < 150}
          >
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
      {userReport && !editEnabled && userReport.report.type !== "Table" && (
        <IconButton
          title="کد گزارش"
          color="primary"
          onClick={embedReportHandler}
        >
          <Code fontSize="small" />
        </IconButton>
      )}
      {userReport &&
        !editEnabled &&
        hasFilters &&
        userReport.report.type === "Table" && (
          <IconButton onClick={filterActionHandler}>
            <FilterList color="primary" fontSize="small" />
          </IconButton>
        )}
      {userReport && !editEnabled && ReportContainer.isDrillDown(instanceId) && (
        <IconButton onClick={backActionHandler} title="بازگشت">
          <ArrowUpward color="primary" fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

const WithSnackbar = withSnackbar(ReportCardActions);

export default withRouter(WithSnackbar);
