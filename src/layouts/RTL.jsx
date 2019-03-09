import React, { Component } from "react";
import axios from "axios";
import moment from "moment-jalaali";
import { withStyles } from "@material-ui/core/styles";
import PerfectScrollbar from "perfect-scrollbar";
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
  jssPreset
} from "@material-ui/core/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import JssProvider from "react-jss/lib/JssProvider";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../hoc/PrivateRoute";
import styles from "./RTLStyles";
import routes, { loginRoute } from "../routes";

import classNames from "classnames";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import cyan from "@material-ui/core/colors/cyan";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

import Sidebar from "../components/Sidebar/Sidebar";
import NavbarLinks from "../components/NavbarLinks/NavbarLinks";
import Main from "../components/Main";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: { main: cyan["700"] },
    secondary: { main: green["600"] },
    error: { main: red["400"] }
  },
  direction: "rtl",
  typography: {
    useNextVariants: true,
    fontSize: 13,
    fontFamily: "IRANSans"
  },
  overrides: {
    MuiButton: {
      root: {
        marginRight: "8px"
      }
    }
  }
});

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

// Custom Material-UI class name generator.
const generateClassName = createGenerateClassName();

const getRoutes = () => {
  return routes.map((route, key) => (
    <PrivateRoute
      path={route.path}
      exact
      component={route.component}
      key={key}
    />
  ));
};

class RTL extends Component {
  state = {
    open: true,
    title: ""
  };

  componentDidMount = () => {
    this.resizeListener();
    this.setTitle(this.props.history.location.pathname);
    this.configAxios();
    this.configMoment();
    this.ps = new PerfectScrollbar(this.refs.mainPanel);
    window.addEventListener("resize", this.resizeListener);
  };

  componentDidUpdate = prevProps => {
    const path = prevProps.history.location.pathname;
    const oldPath = prevProps.location.pathname;
    if (oldPath !== path) {
      this.setTitle(path);
      this.ps.update();
    }
    this.refs.mainPanel.scrollTop = 0;
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeListener);
  }

  setTitle = path => {
    const route = routes.find(r => r.path === path);
    this.setState({ title: route ? route.title : "" });
  };

  configAxios = () => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if ([401, 403].indexOf(error.response.status) > -1) {
          this.props.history.push(loginRoute.path);
        }
        return Promise.reject(error);
      }
    );
  };

  configMoment = () => {
    moment.loadPersian({ dialect: "persian-modern" });
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  resizeListener = () => {
    const sm = this.props.theme.breakpoints.width("md");
    if (window.innerWidth >= sm) {
      !this.state.open && this.setState({ open: true });
    } else {
      this.state.open && this.setState({ open: false });
    }
  };

  render = () => {
    const { location, classes } = this.props;
    const { open, title } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar
              position="fixed"
              className={classNames(classes.appBar, {
                [classes.appBarShift]: open
              })}
            >
              <Toolbar disableGutters={!open}>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerToggle}
                  className={classNames(classes.menuButton, {
                    [classes.menuButtonOpen]: open
                  })}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  color="inherit"
                  noWrap
                  style={{ flexGrow: 1 }}
                >
                  {title}
                </Typography>
                <NavbarLinks />
              </Toolbar>
            </AppBar>
            <Sidebar
              open={open}
              location={location}
              handleDrawerToggle={this.handleDrawerToggle}
            />
            <main
              className={classNames(classes.content, {
                [classes.contentShift]: open
              })}
              ref="mainPanel"
            >
              <Switch>
                <Route
                  path={loginRoute.path}
                  component={loginRoute.component}
                />
                <Main>{getRoutes()}</Main>
              </Switch>
            </main>
          </div>
        </JssProvider>
      </MuiThemeProvider>
    );
  };
}

export default withStyles(styles, { withTheme: true })(RTL);
