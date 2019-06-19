import React, { useEffect, useState } from "react";
import { find } from "lodash";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import NavbarLinks from "../NavbarLinks/NavbarLinks";
import DashboardLinks from "../DashboardLinks/DashboardLinks";
import LayoutContainer from "../../containers/Layout.container";
import routes from "../../routes";

const MyAppBar = props => {
  const { open, isSmallScreen, path, handleDrawerToggle } = props;
  const [title, setTitle] = useState("داشبورد");

  const handleChangeTitle = () => {
    if (path.startsWith("/user/dashboard/")) {
      const t = LayoutContainer.getDashboardName2(path);
      console.log(t);
      setTitle(t);
    }
    const route = find(routes, r =>
      r.matchTest ? r.matchTest(path) : r.path === path
    );
    setTitle(route ? route.title : "");
  };

  useEffect(handleChangeTitle, []);
  useEffect(handleChangeTitle, [path]);

  return (
    <AppBar
      position="fixed"
      className={open && !isSmallScreen ? "appBar appBarShift" : "appBar"}
    >
      <Toolbar disableGutters={true}>
        <IconButton
          onClick={handleDrawerToggle}
          className={
            open && !isSmallScreen ? "menuButton menuButtonOpen" : "menuButton"
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
