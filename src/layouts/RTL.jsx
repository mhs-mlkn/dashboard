import React, { Component } from "react";
// import Axios from "axios";
import moment from "moment-jalaali";
import { withTheme } from "@material-ui/core/styles";
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
import routes, { loginRoute } from "../routes";

import CssBaseline from "@material-ui/core/CssBaseline";

import cyan from "@material-ui/core/colors/cyan";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

import AppBar from "../components/AppBar/AppBar";
import Sidebar from "../components/Sidebar/Sidebar";
import Main from "../components/Main";
import "./RTLStyles.css";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: { main: cyan["700"] },
    secondary: { main: green["600"] },
    error: { main: red["400"] },
    text: {
      primary: "#fff"
    }
  },
  direction: "rtl",
  typography: {
    useNextVariants: true,
    fontSize: 10,
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
    isSmallScreen: false
  };

  componentDidMount = () => {
    this.resizeListener();
    this.configAxios();
    this.configMoment();
    window.addEventListener("resize", this.resizeListener);
  };

  componentDidUpdate = prevProps => {
    const path = prevProps.history.location.pathname;
    const oldPath = prevProps.location.pathname;
    if (oldPath !== path) {
      window.scrollTo(0, 0);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeListener);
  }

  configAxios = () => {
    // Axios.interceptors.response.use(
    //   response => response,
    //   error => {
    //     // if ([401, 403].indexOf(error.response.status) > -1) {
    //     //   this.props.history.push(loginRoute.path);
    //     // }
    //     return Promise.reject(error);
    //   }
    // );
  };

  configMoment = () => {
    moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  resizeListener = () => {
    const sm = this.props.theme.breakpoints.width("md");
    if (window.innerWidth >= sm) {
      !this.state.open && this.setState({ open: true, isSmallScreen: false });
    } else {
      this.state.open && this.setState({ open: false, isSmallScreen: true });
    }
  };

  render = () => {
    const { location } = this.props;
    const { open, isSmallScreen } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <div className={"root"}>
            <CssBaseline />
            <AppBar
              open={open}
              isSmallScreen={isSmallScreen}
              path={this.props.history.location.pathname}
              handleDrawerToggle={this.handleDrawerToggle}
            />
            <Sidebar
              open={open}
              location={location}
              handleDrawerToggle={this.handleDrawerToggle}
            />
            <main
              className={
                open && !isSmallScreen ? "content contentShift" : "content"
              }
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

export default withTheme()(RTL);
