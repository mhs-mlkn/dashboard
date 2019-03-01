import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContainer from "../containers/Auth.container";
import { Subscribe } from "unstated";
import { loginRoute } from "../routes";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Subscribe to={[AuthContainer]}>
    {Auth => (
      <Route
        {...rest}
        render={props =>
          Auth.isLoggedIn() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: loginRoute.path,
                state: { from: props.location }
              }}
            />
          )
        }
      />
    )}
  </Subscribe>
);

export default PrivateRoute;
