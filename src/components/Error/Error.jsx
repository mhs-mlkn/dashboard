import React from "react";
import Grid from "@material-ui/core/Grid";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import Typography from "@material-ui/core/Typography";

const Error = props => {
  const { message } = props;
  return (
    <Grid
      container
      spacing={16}
      justify="center"
      alignItems="center"
      direction="column"
      style={{ height: "100%" }}
    >
      <Grid item>
        <Typography color="error" variant="h5">
          <ErrorOutline fontSize="large" />
        </Typography>
      </Grid>
      <Grid item>
        <Typography color="error" variant="h5" gutterBottom>
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Error;
