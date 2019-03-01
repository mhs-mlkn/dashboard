import React from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = props => {
  return (
    <Grid container spacing={16} justify="center">
      <CircularProgress />
    </Grid>
  );
};

export default Loading;
