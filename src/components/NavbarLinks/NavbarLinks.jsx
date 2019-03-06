import React from "react";
import { Subscribe } from "unstated";
import { withRouter } from "react-router";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import AccountCircle from "@material-ui/icons/AccountCircle";
import AspectRatio from "@material-ui/icons/AspectRatio";
import Save from "@material-ui/icons/Save";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AuthContainer from "../../containers/Auth.container";
import { loginRoute } from "../../routes";

const NavbarLinks = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [editEnabled, setEdit] = React.useState(false);
  const open = Boolean(anchorEl);

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = async e => {
    setAnchorEl(null);
    if (e.target.id === "logout") {
      await AuthContainer.logout();
      props.history.push(loginRoute.path);
    }
  };

  const handleAction = () => {
    setEdit(editEnabled => {
      const event = new CustomEvent("EDIT_LAYOUT_EVENT", {
        detail: !editEnabled
      });
      document.dispatchEvent(event);
      return !editEnabled;
    });
  };

  return (
    <Subscribe to={[AuthContainer]}>
      {Auth =>
        Auth.user && (
          <div>
            {props.location.pathname === "/user/dashboard" && (
              <Button color="primary" size="small" onClick={handleAction}>
                {editEnabled ? (
                  <Save fontSize="small" />
                ) : (
                  <AspectRatio fontSize="small" />
                )}
                {editEnabled ? "  ذخیره" : " ویرایش"}
              </Button>
            )}
            <IconButton onClick={handleMenu} color="inherit">
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
              <MenuItem onClick={handleClose}>{Auth.user}</MenuItem>
              <MenuItem id="logout" onClick={handleClose}>
                خروج
              </MenuItem>
            </Menu>
          </div>
        )
      }
    </Subscribe>
  );
};

export default withRouter(NavbarLinks);
