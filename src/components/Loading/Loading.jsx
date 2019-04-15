import React from "react";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = () => {
  return (
    <Grid
      container
      spacing={0}
      justify="center"
      alignItems="center"
      style={{ height: "100%" }}
    >
      <CircularProgress />
    </Grid>
  );
};

export default Loading;
