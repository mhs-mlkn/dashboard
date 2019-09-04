import React, { useState } from "react";
import { get } from "lodash";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "../../../components/Dialog/Dialog";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import NewDashboardForm from "../../Report/List/NewDashboard";
import LayoutContainer from "../../../containers/Layout.container";

const DashboardRow = props => {
  const { dashboard, formikProps, index } = props;
  const [state, setState] = useState({
    deleteConfirm: false,
    deleteLoading: false,
    renameConfirm: false,
    renameLoading: false
  });

  const toggle = prop => () => {
    const value = get(state, prop);
    setState({ [prop]: !value });
  };

  const hanleRenameName = async () => {
    try {
      toggle("renameLoading")();
      await LayoutContainer.renameDashboard(
        props.dashboard.id,
        LayoutContainer.newDashboardName,
        props.dashboard.shared
      );
    } catch (error) {
      props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    } finally {
      LayoutContainer.setNewDashboardName("");
      toggle("renameConfirm")();
      toggle("renameLoading")();
    }
  };

  const handleDeleteDashboard = async () => {
    toggle("deleteConfirm")();
    const dashboard = props.dashboard;
    if (dashboard.shared) {
      return alert(
        "داشبورد با شما به اشتراک گذاشته شده است\nنمیتوانید آن را حذف کنید"
      );
    }
    try {
      toggle("deleteLoading")();
      await LayoutContainer.deleteDashboard(dashboard.id);
    } catch (error) {
      const msg = get(
        error,
        "response.data.message",
        "حذف داشبورد با خطا مواجه شد"
      );
      props.enqueueSnackbar(msg, {
        variant: "error"
      });
    } finally {
      toggle("deleteLoading")();
    }
  };

  return (
    <>
      <Dialog
        title="تغییر نام داشبورد"
        open={state.renameConfirm}
        loading={state.renameLoading}
        maxWidth="sm"
        onSave={hanleRenameName}
        onClose={toggle("renameConfirm")}
      >
        <NewDashboardForm />
      </Dialog>
      <ConfirmDialog
        title="آیا اطمینان دارید؟"
        handleConfirm={handleDeleteDashboard}
        handleClose={toggle("deleteConfirm")}
        open={state.deleteConfirm}
      />
      <TableRow key={dashboard.id}>
        <TableCell>{dashboard.id}</TableCell>
        <TableCell>{dashboard.name}</TableCell>
        <TableCell>
          {
            <Switch
              name={`dashboards.${index}.config.slide.isVisible`}
              checked={dashboard.config.slide.isVisible}
              onChange={formikProps.handleChange}
              value={dashboard.config.slide.isVisible}
            />
          }
        </TableCell>
        <TableCell>
          {
            <TextField
              name={`dashboards.${index}.config.slide.duration`}
              label="مدت زمان نمایش (ثانیه)"
              value={dashboard.config.slide.duration}
              type="number"
              onChange={formikProps.handleChange}
              margin="dense"
              variant="outlined"
              error={!!get(formikProps.errors, `dashboards.${index}.duration`)}
              helperText={get(
                formikProps.errors,
                `dashboards.${index}.duration`
              )}
              inputProps={{
                min: 10,
                step: 5
              }}
              style={{ display: "block" }}
            />
          }
        </TableCell>
        <TableCell align="right">
          <IconButton
            color="primary"
            title="تغییر نام"
            onClick={toggle("renameConfirm")}
          >
            <EditIcon />
          </IconButton>
          <IconButton title="حذف داشبورد" onClick={toggle("deleteConfirm")}>
            <DeleteForeverIcon color="error" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default DashboardRow;
