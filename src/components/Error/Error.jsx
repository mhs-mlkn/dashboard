import React from "react";
import Grid from "@material-ui/core/Grid";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import Refresh from "@material-ui/icons/Refresh";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

const Error = props => {
  const { message, onRetry = false } = props;
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
          {!!onRetry && (
            <IconButton color="primary" title="تلاش مجدد" onClick={onRetry}>
              <Refresh fontSize="small" />
            </IconButton>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Error;
