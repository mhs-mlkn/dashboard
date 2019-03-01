import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import Icon from "@material-ui/core/Icon";
import Hidden from "@material-ui/core/Hidden";
import { NavLink } from "react-router-dom";

import routes from "../../routes";

import styles from "./SidebarStyles";

const sidebar = props => {
  const { open, classes } = props;
  const activeRoute = path => {
    // return props.location.pathname.indexOf(path) > -1 ? true : false;
    return props.location.pathname === path;
  };
  const getLinks = () =>
    routes.map((route, index) => {
      const isActive = activeRoute(route.path);
      const listItemClasses = classNames({
        [classes.activeItem]: isActive
      });
      const itemIconClasses = classNames({
        [classes.itemIcon]: true,
        [classes.activeItemIcon]: isActive
      });

      if (route.invisible) return null;

      return (
        <NavLink
          to={route.path}
          activeClassName="active"
          className={classes.item}
          key={index}
        >
          <ListItem button className={listItemClasses}>
            <ListItemIcon className={itemIconClasses}>
              {typeof route.icon === "string" ? (
                <Icon>{route.icon}</Icon>
              ) : (
                <route.icon />
              )}
            </ListItemIcon>
            <ListItemText primary={route.title} disableTypography={true} />
          </ListItem>
        </NavLink>
      );
    });

  return (
    <>
      <Hidden mdUp>
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
        >
          <div className={classes.drawerHeader}>POD DASHBOARD</div>
          <Divider />
          <List>{getLinks()}</List>
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>POD DASHBOARD</div>
          <Divider />
          <List>{getLinks()}</List>
        </Drawer>
      </Hidden>
    </>
  );
};

export default withStyles(styles)(sidebar);
