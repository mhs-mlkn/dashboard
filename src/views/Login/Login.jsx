import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Page from "../../components/Page/Page";
import Auth from "../../containers/Auth.container";

const SSO = process.env.REACT_APP_POD_SSO_CODE;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

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
    if (qs && qs.code) {
      try {
        await Auth.checkToken(qs.code);
        // await Auth.fetchUser();
      } catch (error) {
        this.setState({ error });
      } finally {
        this.props.history.push("/");
      }
    } else {
      setTimeout(this.login, 2000);
    }
  };

  login = () => {
    Auth.generateVerifier();
    const CHALLENGE_CODE = Auth.getChallenegeCode();
    const LOGIN_URL = `${SSO}&client_id=${CLIENT_ID}&code_challenge=${CHALLENGE_CODE}&redirect_uri=${REDIRECT_URI}`;
    window.location.href = LOGIN_URL;
  };

  handleLoginClick = e => {
    e.preventDefault();
    this.login();
  };

  render = () => {
    const { loading } = this.state;
    return (
      <Page loading={loading}>
        <Typography
          component="p"
          variant="title"
          color="textSecondary"
          gutterBottom
        >
          درحال انتقال به صفحه ورود
        </Typography>
        <Typography component="p" variant="subheading" color="textSecondary">
          درصورت عدم انتقال خودکار{"  "}
          <Link href={""} color="secondary" onClick={this.handleLoginClick}>
            اینجا
          </Link>
          {"  "}
          کلیک کنید
        </Typography>
      </Page>
    );
  };
}

export default Login;
