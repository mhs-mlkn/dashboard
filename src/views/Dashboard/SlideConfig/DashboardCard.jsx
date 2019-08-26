import React, { Component } from "react";
import { get } from "lodash";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
// import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const styles = () => ({
  card: {
    maxWidth: 400
  },
  actions: {
    display: "flex"
  }
});

class DashboardCard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, dashboard, formikProps, index } = this.props;
    const error = get(formikProps.errors, `dashboards.${index}.duration`);

    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={dashboard.name}
        />
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                name={`dashboards.${index}.config.slide.isVisible`}
                checked={dashboard.config.slide.isVisible}
                onChange={formikProps.handleChange}
                value={dashboard.config.slide.isVisible}
              />
            }
            label="نمایش در اسلایدشو"
          />
          <TextField
            name={`dashboards.${index}.config.slide.duration`}
            label="مدت زمان نمایش (ثانیه)"
            value={dashboard.config.slide.duration}
            type="number"
            onChange={formikProps.handleChange}
            margin="dense"
            variant="outlined"
            error={!!error}
            helperText={error}
            inputProps={{
              min: 10,
              step: 5
            }}
            style={{ display: "block" }}
          />
        </CardContent>
        {/* <CardActions className={classes.actions} disableActionSpacing>
          <IconButton title="حذف داشبورد">
            <DeleteForeverIcon color="error" />
          </IconButton>
        </CardActions> */}
      </Card>
    );
  }
}

export default withStyles(styles)(DashboardCard);
