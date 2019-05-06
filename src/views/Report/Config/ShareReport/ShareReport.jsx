import React, { useEffect, useState } from "react";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import MuiChip from "@material-ui/core/Chip";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Loading from "../../../../components/Loading/Loading";
import MyCustomEvent from "../../../../util/customEvent";
import ReportApi from "../../../../api/report.api";
import ShareReportForm from "./ShareReportForm";

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

const Chip = withStyles(theme => ({
  root: {
    margin: theme.spacing.unit / 2
  }
}))(MuiChip);

const ShareReport = props => {
  const { fullScreen } = props;

  const [open, setOpen] = useState(false);
  const [reportId, setReportId] = useState(-1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    MyCustomEvent.on("SHARE_REPORT", handleToggleOpen);

    return function cleanup() {
      MyCustomEvent.removeEventListener("SHARE_REPORT", handleToggleOpen);
    };
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [reportId, open]);

  const handleToggleOpen = reportId => {
    setOpen(!open, setReportId(reportId));
  };

  const fetchUsers = async () => {
    if (!reportId || reportId < 0 || !open) return;

    try {
      setLoading(true);
      const users = await ReportApi.getReportUsers(reportId);
      setUsers(users);
    } catch (error) {
      setError("دریافت لیست کاربران با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = user => async () => {
    try {
      setLoading(true);
      await ReportApi.removeReportUser(reportId, user.id);
      const filteredUsers = users.filter(u => u.id !== user.id);
      setUsers(filteredUsers);
      setLoading(false);
      props.enqueueSnackbar("با موفقیت حذف شد", {
        variant: "success"
      });
    } catch (error) {
      setLoading(false);
      props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    }
  };

  const handleSubmit = async identity => {
    if (!identity) {
      return props.enqueueSnackbar("مشخصات کاربر را وارد کنید", {
        variant: "error"
      });
    }
    try {
      setLoading(true);
      const user = await ReportApi.addReportUser(reportId, identity);
      setUsers([...users, user]);
    } catch (error) {
      props.enqueueSnackbar(error.message, {
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      TransitionComponent={Transition}
      fullWidth
      onClose={handleToggleOpen}
    >
      <DialogTitle>اشتراک گذاری گزارش</DialogTitle>
      <DialogContent>
        {error ? (
          <Typography color="error" variant="h5" gutterBottom>
            {error}
          </Typography>
        ) : loading ? (
          <Loading />
        ) : (
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={12} lg={12}>
              <ShareReportForm onSubmit={handleSubmit} />
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              {users.map(user => (
                <Chip
                  key={user.id}
                  label={user.username}
                  onDelete={handleDelete(user)}
                  variant="outlined"
                />
              ))}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleToggleOpen} color="primary" autoFocus>
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const WithMobileDialog = withMobileDialog({ breakpoint: "xs" })(ShareReport);
const WithRouter = withRouter(WithMobileDialog);
export default withSnackbar(WithRouter);
