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
import LinearProgress from "@material-ui/core/LinearProgress";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Loading from "../../../components/Loading/Loading";
import MyCustomEvent from "../../../util/customEvent";
import LayoutContainer from "../../../containers/Layout.container";
import ShareDashboardForm from "./ShareDashboardForm";
import Api from "../../../api/report.api";

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

const ShareDashboard = props => {
  const { fullScreen } = props;

  const [open, setOpen] = useState(false);
  const [sharedItems, setSharedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addUserLoading, setUserLoading] = useState(false);
  const [error, setError] = useState("");

  const { index } = props.match.params;
  const dashboard = LayoutContainer.getDashboard(index);

  useEffect(() => {
    MyCustomEvent.on("SHARE_DASHBOARD", handleToggleOpen);

    return function cleanup() {
      MyCustomEvent.removeEventListener("SHARE_DASHBOARD", handleToggleOpen);
    };
  }, []);

  useEffect(() => {
    try {
      setLoading(true);
      fetchUsers();
    } catch (error) {
      setError("دریافت لیست کاربران با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  }, [props.match.params.index, open]);

  const handleToggleOpen = () => setOpen(!open);

  const fetchUsers = async () => {
    if (!open) return;

    const sharedItems = await Api.getDashboardUsers(dashboard.id);
    setSharedItems(sharedItems);
  };

  const handleDelete = sharedItem => async () => {
    try {
      await Api.deleteDashboardUser(sharedItem.id);
      const items = sharedItems.filter(item => +item.id !== +sharedItem.id);
      setSharedItems(items);
      props.enqueueSnackbar("با موفقیت حذف شد", {
        variant: "success"
      });
    } catch (error) {
      props.enqueueSnackbar("حذف کاربر با خطا مواجه شد", {
        variant: "error"
      });
    }
  };

  const handleSubmit = async ({ identity, expire }) => {
    try {
      setUserLoading(true);
      await Api.addDashboardUser(dashboard.id, {
        identity,
        expire: expire.format("YYYY-MM-DD"),
        editable: true
      });
      await fetchUsers();
    } catch (error) {
      props.enqueueSnackbar(error.message, {
        variant: "error"
      });
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      onClose={handleToggleOpen}
    >
      <DialogTitle>اشتراک گذاری داشبورد</DialogTitle>
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
              <ShareDashboardForm onSubmit={handleSubmit} />
              {addUserLoading && <LinearProgress />}
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <div style={{ marginTop: "16px" }}>
                {sharedItems.map(item => (
                  <Chip
                    key={item.id}
                    label={item.user.username}
                    onDelete={handleDelete(item)}
                    variant="outlined"
                  />
                ))}
              </div>
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

const WithMobileDialog = withMobileDialog({ breakpoint: "xs" })(ShareDashboard);
const WIthSnackbar = withSnackbar(WithMobileDialog);
export default withRouter(WIthSnackbar);
