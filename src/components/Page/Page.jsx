import React from "react";
import { withStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
import Loading from "../Loading/Loading";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

const page = props => {
  const { loading, classes, children } = props;
  return (
    <div className={classes.root} elevation={1}>
      {loading ? <Loading /> : children}
    </div>
  );
};

export default withStyles(styles)(page);
