import React, { Component } from "react";
import { withRouter } from "react-router";
import { SnackbarProvider } from "notistack";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Page from "./Page/Page";
import Loading from "./Loading/Loading";
import AuthContainer from "../containers/Auth.container";
import LayoutContainer from "../containers/Layout.container";
import ReportContainer from "../containers/Report.container";

class Main extends Component {
  state = {
    error: "",
    loading: false
  };

  componentDidMount = async () => {
    await this.loadInitilData();
  };

  loadInitilData = async () => {
    try {
      this.setState({ loading: true });
      await AuthContainer.refreshToken();
      await Promise.all([
        AuthContainer.fetchUser(),
        LayoutContainer.fetchDashboards(),
        ReportContainer.getAll(0, 12),
        ReportContainer.getUserReports()
      ]);
      this.setState({ loading: false });
    } catch (error) {
      if (error && error.response && error.response.status === 401) {
        return this.props.history.push("/user/login");
      }
      this.setState({ loading: false, error });
    }
  };

  // static getDerivedStateFromError(error) {
  //   return { error };
  // }

  componentDidCatch(error, info) {
    console.log(JSON.stringify(error));
    this.setState({ error });
  }

  reset = () => {
    window.location.reload();
  };

  render = () => {
    const { loading, error } = this.state;
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <Page>
          <Typography color="error" variant="h3" gutterBottom>
            خطا
          </Typography>
          <Typography color="error" variant="h5" gutterBottom>
            {/* {error.message || error || "خطا در برقراری ارتباط با سرور"} */}
            خطا در برقراری ارتباط با سرور
          </Typography>
          <Button color="primary" variant="outlined" onClick={this.reset}>
            تلاش مجدد
          </Button>
        </Page>
      );
    }

    return (
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        autoHideDuration={2000}
      >
        <>{this.props.children}</>
      </SnackbarProvider>
    );
  };
}

export default withRouter(Main);
