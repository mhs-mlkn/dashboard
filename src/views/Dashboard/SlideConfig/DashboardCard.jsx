import React, { Component } from "react";
import { get } from "lodash";
import { withSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import Dialog from "../../../components/Dialog/Dialog";
import NewDashboardForm from "../../Report/List/NewDashboard";
import LayoutContainer from "../../../containers/Layout.container";

const styles = () => ({
  card: {
    maxWidth: 400
  },
  actions: {
    display: "flex"
  }
});

class DashboardCard extends Component {
  state = {
    deleteConfirm: false,
    deleteLoading: false,
    renameConfirm: false,
    renameLoading: false
  };

  toggle = prop => () => {
    const value = get(this.state, prop);
    this.setState({ [prop]: !value });
  };

  hanleRenameName = async () => {
    try {
      this.toggle("renameLoading")();
      await LayoutContainer.renameDashboard(
        this.props.dashboard.id,
        LayoutContainer.newDashboardName,
        this.props.dashboard.shared
      );
    } catch (error) {
      this.props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    } finally {
      LayoutContainer.setNewDashboardName("");
      this.toggle("renameConfirm")();
      this.toggle("renameLoading")();
    }
  };

  handleDeleteDashboard = async () => {
    this.toggle("deleteConfirm")();
    const dashboard = this.props.dashboard;
    if (dashboard.shared) {
      return alert(
        "داشبورد با شما به اشتراک گذاشته شده است\nنمیتوانید آن را حذف کنید"
      );
    }
    try {
      this.toggle("deleteLoading")();
      await LayoutContainer.deleteDashboard(dashboard.id);
    } catch (error) {
      const msg = get(
        error,
        "response.data.message",
        "حذف داشبورد با خطا مواجه شد"
      );
      this.props.enqueueSnackbar(msg, {
        variant: "error"
      });
    } finally {
      this.toggle("deleteLoading")();
    }
  };

  render() {
    const { classes, dashboard, formikProps, index } = this.props;
    const error = get(formikProps.errors, `dashboards.${index}.duration`);

    return (
      <>
        <Dialog
          title="تغییر نام داشبورد"
          open={this.state.renameConfirm}
          loading={this.state.renameLoading}
          maxWidth="sm"
          onSave={this.hanleRenameName}
          onClose={this.toggle("renameConfirm")}
        >
          <NewDashboardForm />
        </Dialog>
        <ConfirmDialog
          title="آیا اطمینان دارید؟"
          handleConfirm={this.handleDeleteDashboard}
          handleClose={this.toggle("deleteConfirm")}
          open={this.state.deleteConfirm}
        />
        <Card className={classes.card}>
          <CardHeader
            action={
              <IconButton
                color="primary"
                title="تغییر نام"
                onClick={this.toggle("renameConfirm")}
              >
                <EditIcon />
              </IconButton>
            }
            title={dashboard.name}
          />
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  name={`dashboards.${index}.config.slide.isVisible`}
                  checked={dashboard.config.slide.isVisible}
                  onChange={formikProps.handleChange}
                  value={dashboard.config.slide.isVisible}
                />
              }
              label="نمایش در اسلایدشو"
            />
            <TextField
              name={`dashboards.${index}.config.slide.duration`}
              label="مدت زمان نمایش (ثانیه)"
              value={dashboard.config.slide.duration}
              type="number"
              onChange={formikProps.handleChange}
              margin="dense"
              variant="outlined"
              error={!!error}
              helperText={error}
              inputProps={{
                min: 10,
                step: 5
              }}
              style={{ display: "block" }}
            />
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton
              title="حذف داشبورد"
              onClick={this.toggle("deleteConfirm")}
            >
              <DeleteForeverIcon color="error" />
            </IconButton>
            {this.state.deleteLoading && (
              <CircularProgress
                color="secondary"
                size={36}
                style={{
                  position: "relative",
                  right: -41,
                  zIndex: 1
                }}
              />
            )}
          </CardActions>
        </Card>
      </>
    );
  }
}

const WIthSnackbar = withSnackbar(DashboardCard);
export default withStyles(styles)(WIthSnackbar);
