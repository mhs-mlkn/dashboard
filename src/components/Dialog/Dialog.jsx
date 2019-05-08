import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Loading from "../Loading/Loading";

const Transition = props => {
  return <Slide direction="up" {...props} />;
};

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2
  }
}))(props => {
  const { children, classes } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit
  }
}))(MuiDialogActions);

const CustomDialog = props => {
  const {
    fullScreen,
    open,
    loading,
    error,
    title,
    onClose,
    onSave,
    saveText = "ذخیره",
    children
  } = props;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth="md"
      scroll="body"
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error ? (
          <Typography color="error" variant="h5" gutterBottom>
            {error}
          </Typography>
        ) : loading ? (
          <Loading />
        ) : (
          children
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" autoFocus>
          بستن
        </Button>
        {onSave && (
          <Button onClick={onSave} color="primary" autoFocus>
            {saveText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const WithMobileDialog = withMobileDialog({ breakpoint: "md" })(CustomDialog);
export default WithMobileDialog;
