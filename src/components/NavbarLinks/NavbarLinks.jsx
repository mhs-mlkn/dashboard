import React from "react";
import { Subscribe } from "unstated";
import { withRouter } from "react-router";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Share from "@material-ui/icons/Share";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AuthContainer from "../../containers/Auth.container";
import LayoutContainer from "../../containers/Layout.container";
import { loginRoute } from "../../routes";
import Timer from "../Timer";
import MyCustomEvent from "../../util/customEvent";
import DeleteDashboard from "./DeleteDashboard";
import { CHANGE_DASHBOARD_INTERVAL } from "../../constants";

const NavbarLinks = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleShareDashboard = () => {
    MyCustomEvent.emit("SHARE_DASHBOARD");
  };

  const handleClose = async e => {
    setAnchorEl(null);
    if (e.target.id === "logout") {
      await AuthContainer.logout();
      props.history.push(loginRoute.path);
    }
  };

  const isDashboardRoute = () =>
    RegExp("/user/dashboard/\\d+", "g").test(props.location.pathname);

  const isVisible = () => {
    if (isDashboardRoute()) {
      const urlParts = props.location.pathname.split("/");
      const dashboardId = urlParts[urlParts.length - 1];
      const dashboard = LayoutContainer.getDashboard(dashboardId);
      return !!dashboard && !dashboard.shared;
    }
    return false;
  };

  return (
    <Subscribe to={[AuthContainer, LayoutContainer]}>
      {(Auth, Layout) =>
        Auth.isLoggedIn() ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {isVisible() && Layout.state.dashboards.length > 1 && (
              <Timer changeInterval={CHANGE_DASHBOARD_INTERVAL} />
            )}
            {isVisible() && (
              <>
                <DeleteDashboard />
                <Button
                  onClick={handleShareDashboard}
                  color="primary"
                  variant="outlined"
                >
                  <Share fontSize="small" />
                  اشتراک گذاری
                </Button>
              </>
            )}
            <IconButton onClick={handleMenu} color="primary">
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>{Auth.getUsername()}</MenuItem>
              <MenuItem id="logout" onClick={handleClose}>
                خروج
              </MenuItem>
            </Menu>
          </div>
        ) : null
      }
    </Subscribe>
  );
};

export default withRouter(NavbarLinks);
