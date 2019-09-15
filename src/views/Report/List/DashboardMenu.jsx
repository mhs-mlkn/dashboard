import React, { useState } from "react";
import { Subscribe } from "unstated";
import { withSnackbar } from "notistack";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "../../../components/Dialog/Dialog";
import NewDashboardForm from "./NewDashboard";
import LayoutContainer from "../../../containers/Layout.container";

const DashboardMenu = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectDashboard = dashboardId => async () => {
    handleMenuClose();
    await addToDashboard(dashboardId);
  };

  const addToDashboard = async dashboardId => {
    const { reportId } = props;
    return props.navigate(
      `/user/reports/${reportId}/config/params/${dashboardId}`
    );
  };

  const toggleNewDashboardModal = () => {
    return setOpen(!open);
  };

  const handleSaveNewDashboard = async () => {
    try {
      setLoading(true);
      await LayoutContainer.addDashboard(LayoutContainer.newDashboardName);
    } catch (error) {
      props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    } finally {
      LayoutContainer.setNewDashboardName("");
      toggleNewDashboardModal();
      setLoading(false);
    }
  };

  return (
    <Subscribe to={[LayoutContainer]}>
      {Layout => (
        <>
          <Dialog
            title="نام داشبورد جدید"
            open={open}
            loading={loading}
            maxWidth="sm"
            onSave={handleSaveNewDashboard}
            onClose={toggleNewDashboardModal}
          >
            <NewDashboardForm />
          </Dialog>
          <IconButton title="انتخاب" color="primary" onClick={handleMenuClick}>
            <AddIcon fontSize="small" />
          </IconButton>
          <Menu
            id="dashboards-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {Layout.state.dashboards
              .filter(d => !d.shared)
              .map(d => (
                <MenuItem
                  key={d.id}
                  onClick={handleSelectDashboard(d.id)}
                >{`داشبورد ${d.name || d.id}`}</MenuItem>
              ))}
            <MenuItem onClick={toggleNewDashboardModal}>داشبورد جدید</MenuItem>
          </Menu>
        </>
      )}
    </Subscribe>
  );
};

export default withSnackbar(DashboardMenu);
