import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Page from "../../components/Page/Page";
import Auth from "../../containers/Auth.container";

const LOGIN_URL = `${process.env.REACT_APP_LOGIN_URL}`;
const parseQueryString = (queryParams = "") => {
  return queryParams
    ? queryParams
        .split("&")
        .map(str => {
          let [key, value] = str.split("=");
          return { [key]: decodeURI(value) };
        })
        .reduce((prev, curr) => Object.assign(prev, curr))
    : null;
};

class Login extends Component {
  state = {
    loading: false,
    error: ""
  };

  componentDidMount = async () => {
    const qs = parseQueryString(this.props.location.search.slice("1"));
    if (qs && qs.token && qs.refresh && qs.expires) {
      Auth.login(qs);
      await Auth.getUserData(qs);
      this.props.history.push("/");
    }
  };

  render = () => {
    const { loading } = this.state;
    return (
      <Page loading={loading}>
        <Typography component="p" variant="h6">
          برای ادامه باید{"  "}
          <Link href={LOGIN_URL} color="secondary">
            وارد
          </Link>
          {"  "}
          شوید
        </Typography>
      </Page>
    );
  };
}

export default Login;
