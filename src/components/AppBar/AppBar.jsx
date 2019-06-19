import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import NavbarLinks from "../components/NavbarLinks/NavbarLinks";
import DashboardLinks from "../components/DashboardLinks/DashboardLinks";

const MyAppBar = props => {
  const [open, setOpen] = useState(false);
  const title = "";

  return (
    <AppBar
      position="fixed"
      className={open && !this.isSmallScreen ? "appBar appBarShift" : "appBar"}
    >
      <Toolbar disableGutters={true}>
        <IconButton
          onClick={this.handleDrawerToggle}
          className={
            open && !this.isSmallScreen
              ? "menuButton menuButtonOpen"
              : "menuButton"
          }
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="textPrimary" noWrap>
          {title}
        </Typography>
        <DashboardLinks />
        <NavbarLinks />
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
