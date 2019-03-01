import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import PlayArrow from "@material-ui/icons/PlayArrow";
import AlertDialog from "../../../components/Dialog/AlertDialog";

const styles = theme => ({
  iconButton: {
    padding: "4px"
  }
});

const TableActions = props => {
  const [open, setOpen] = useState(false);

  const openAlert = () => setOpen(true);

  const onAlertClose = () => setOpen(false);

  const onAlertConfirm = () => {
    props.onAction("DELETE");
  };

  const { classes } = props;

  return (
    <>
      <AlertDialog
        title="آیا اطمینان دارید؟"
        handleConfirm={onAlertConfirm}
        handleClose={onAlertClose}
        open={open}
      />
      <IconButton
        title="اجرا"
        className={classes.iconButton}
        onClick={() => props.onAction("RUN")}
      >
        <PlayArrow fontSize="small" color="primary" />
      </IconButton>
      <IconButton
        title="ویرایش"
        className={classes.iconButton}
        onClick={() => props.onAction("EDIT")}
      >
        <Edit fontSize="small" color="secondary" />
      </IconButton>
      <IconButton
        title="حذف"
        className={classes.iconButton}
        onClick={openAlert}
      >
        <Delete fontSize="small" color="error" />
      </IconButton>
    </>
  );
};
export default withStyles(styles, { withTheme: true })(TableActions);
