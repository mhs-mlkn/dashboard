import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Page from "./Page/Page";
import Loading from "./Loading/Loading";
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
      await ReportContainer.loadLayout();
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  // static getDerivedStateFromError(error) {
  //   return { error };
  // }

  componentDidCatch(error, info) {
    this.setState({ error });
  }

  render = () => {
    const { error, loading } = this.state;
    if (error) {
      return (
        <Page>
          <Typography color="error" variant="h3" gutterBottom>
            خطا
          </Typography>
          <Typography color="error" variant="h5" gutterBottom>
            {error.message || error || "خطا"}
          </Typography>
        </Page>
      );
    }
    if (loading) {
      return <Loading />;
    }
    return this.props.children;
  };
}

export default Main;
