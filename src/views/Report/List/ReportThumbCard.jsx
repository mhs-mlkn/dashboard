import React, { Component } from "react";
import moment from "moment-jalaali";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";

const styles = theme => ({
  card: {
    // height: 400
  },
  title: {
    fontSize: "1.1rem"
  },
  subheader: {
    fontSize: "0.7rem",
    paddingTop: "5px"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
});

class ReportThumbCard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  render = () => {
    const { classes, report } = this.props;
    const { expanded } = this.state;
    const { name, created, description = "" } = report;
    const date = created.slice(0, created.length - 6);
    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton title="انتخاب" color="primary">
              <AddIcon />
            </IconButton>
          }
          title={name}
          subheader={moment(date).format("LL")}
          classes={{ title: classes.title, subheader: classes.subheader }}
        />
        <CardMedia className={classes.media} title="Paella dish" />
        <CardContent>
          <Typography component="p">
            {description.slice(0, 119)} {description.length > 119 && "..."}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          {description.length > 119 && (
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={this.handleExpandClick}
              aria-expanded={expanded}
              aria-label="نمایش توضیحات"
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>توضیحات: </Typography>
            <Typography>{description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  };
}

export default withStyles(styles)(ReportThumbCard);
