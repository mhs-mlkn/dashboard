import React from "react";
import { Provider } from "unstated";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import RTLLayout from "../layouts/RTL";

const App = props => {
  return (
    <Provider>
      <Router>
        <Switch>
          <Route path="/user" component={RTLLayout} />
          <Redirect from="/" to="/user/dashboard" />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
