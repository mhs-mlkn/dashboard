import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Page from "../Page/Page";

class Error extends Component {
  state = {
    error: ""
  };

  // static getDerivedStateFromError(error) {
  //   return { error };
  // }

  componentDidCatch(error, info) {
    this.setState({ error });
  }

  render = () => {
    const { error } = this.state;
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
    return this.props.children;
  };
}

export default Error;
