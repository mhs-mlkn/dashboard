import React, { Component } from "react";
import { withSnackbar } from "notistack";
import moment from "moment-jalaali";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chart from "../../../components/Chart/Chart";
import Table from "../../../components/Table/Table";
import Scalar from "../../../components/Scalar/Scalar";
import DashboardMenu from "./DashboardMenu";
import * as mockData from "../../../mockdata";

const styles = theme => ({
  card: {
    // height: 400
  },
  Content: {
    paddingLeft: "0",
    paddingRight: "0"
    // paddingTop: "56.25%" // 16:9
  },
  title: {
    fontSize: "1.1rem",
    minHeight: "46px"
  },
  subheader: {
    fontSize: "0.7rem",
    paddingTop: "5px"
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
  },
  description: {
    paddingLeft: "10px",
    paddingRight: "10px"
  },
  hidden: {
    visibility: "hidden"
  }
});

const ASPECT_RATIO = 16 / 9;

class ReportThumbCard extends Component {
  state = {
    expanded: false
  };

  handleExpandClick = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  getReport = (reportType, data) => {
    switch (reportType) {
      case "Table":
        return (
          <Table
            cols={data.cols}
            rows={data.rows}
            count={data.rows.length}
            aspect={ASPECT_RATIO}
          />
        );

      case "Scalar":
        return <Scalar aspect={ASPECT_RATIO} data={data} />;

      default:
        return <Chart aspect={ASPECT_RATIO} data={data} type={reportType} />;
    }
  };

  render = () => {
    const { classes, report, navigate } = this.props;
    const { expanded } = this.state;
    const { name, type, created, description = "" } = report;
    const date = created.slice(0, created.length - 6);
    const data =
      ["Table", "Scalar"].indexOf(type) > -1
        ? mockData[type]
        : mockData["Charts"];

    return (
      <Card className={classes.card}>
        <CardHeader
          action={<DashboardMenu reportId={report.id} navigate={navigate} />}
          title={name}
          subheader={moment(date).format("LL")}
          classes={{
            title: classes.title,
            subheader: classes.subheader
          }}
        />
        <CardContent className={classes.Content}>
          {this.getReport(type, data)}
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          {!expanded && (
            <Typography component="p" className={classes.description}>
              {description.slice(0, 50)} {description.length > 50 && "..."}
            </Typography>
          )}
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: expanded,
              [classes.hidden]: description.length <= 50
            })}
            onClick={this.handleExpandClick}
            aria-expanded={expanded}
            aria-label="نمایش توضیحات"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>{description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  };
}

const WithSnackbar = withSnackbar(ReportThumbCard);
export default withStyles(styles)(WithSnackbar);
