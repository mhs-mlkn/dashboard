import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const AlertDialog = props => {
  const { open, title = "", text = "", handleConfirm, handleClose } = props;

  const confirm = () => {
    handleConfirm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          خیر
        </Button>
        <Button onClick={confirm} color="primary">
          بله
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
