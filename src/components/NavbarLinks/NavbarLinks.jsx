import React from "react";
import { Subscribe } from "unstated";
import { withRouter } from "react-router";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Share from "@material-ui/icons/Share";
import Save from "@material-ui/icons/Save";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AuthContainer from "../../containers/Auth.container";
import LayoutContainer from "../../containers/Layout.container";
import ThemeContainer from "../../containers/Theme.container";
import { loginRoute } from "../../routes";
import Timer from "../Timer";
import MyCustomEvent from "../../util/customEvent";
import DeleteDashboard from "./DeleteDashboard";

const NavbarLinks = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleSave = () => {
    const urlParts = props.location.pathname.split("/");
    const dashboardId = urlParts[urlParts.length - 1];
    const el = document.getElementsByClassName(`react-grid-layout`);
    return domtoimage.toBlob(el[0]).then(function(blob) {
      saveAs(blob, `dashboard ${dashboardId || ""}`);
    });
  };

  const handleShareDashboard = () => {
    MyCustomEvent.emit("SHARE_DASHBOARD");
  };

  const handleClose = async e => {
    setAnchorEl(null);
    if (e.target.id === "logout") {
      AuthContainer.logout();
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

  const isTimerVisible = () => {
    return (
      isDashboardRoute() &&
      LayoutContainer.state.dashboards.filter(d => d.config.slide.isVisible)
        .length > 1
    );
  };

  const getDashboardInterval = () => {
    const urlParts = props.location.pathname.split("/");
    const dashboardId = urlParts[urlParts.length - 1];
    const config = LayoutContainer.getSlideConfig(dashboardId);
    return config.duration;
  };

  const handleThemeChanged = () => ThemeContainer.toggle();

  return (
    <Subscribe to={[AuthContainer, LayoutContainer, ThemeContainer]}>
      {(Auth, Layout, Theme) =>
        Auth.isLoggedIn() ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {isTimerVisible() && (
              <Timer changeInterval={getDashboardInterval()} />
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
            {isDashboardRoute() && Layout.state.dashboards.length > 0 && (
              <IconButton onClick={handleSave} color="primary" title="ذخیره">
                <Save />
              </IconButton>
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
              <MenuItem onClick={handleClose}>{Auth.state.username}</MenuItem>
              <MenuItem onClick={handleThemeChanged}>
                {Theme.state.type === "dark" ? "تم روشن" : "تم تیره"}
              </MenuItem>
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
