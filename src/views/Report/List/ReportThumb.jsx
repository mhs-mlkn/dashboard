import React, { Component } from "react";
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
import AddIcon from "@material-ui/icons/Add";
import Chart from "../../../components/Chart/Chart";
import Table from "../../../components/Table/Table";
import Scalar from "../../../components/Scalar/Scalar";
import ReportContainer from "../../../containers/Report.container";
import data, { table } from "../../../mockdata";

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
    fontSize: "1.1rem"
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

class ReportThumbCard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  addToDashboard = async () => {
    const { report } = this.props;
    const hasParams = report.query.queryParams.some(p => p.byUser);
    if (hasParams) {
      return this.props.navigate(`/user/reports/${report.id}/params`);
    }

    try {
      this.setState({ loading: true });
      const instanceId = await ReportContainer.setParams(report.id, []);
      await ReportContainer.addLayout(instanceId, report.id);
      this.setState({ loading: false });
      this.props.navigate("/user/dashboard");
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  };

  getReport = (report, data) => {
    switch (report.type) {
      case "Table":
        return (
          <Table
            cols={table.cols}
            rows={table.rows}
            count={table.rows.length}
            aspect={1.777777777777778}
          />
        );

      case "Scalar":
        return (
          <Scalar aspect={1.777777777777778} data={["مجموع کاربران", 849]} />
        );

      case "Timeline":
        return "Timeline";

      default:
        return (
          <Chart aspect={1.777777777777778} data={data} type={report.type} />
        );
    }
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
            <IconButton
              title="انتخاب"
              color="primary"
              onClick={this.addToDashboard}
            >
              <AddIcon />
            </IconButton>
          }
          title={name}
          subheader={moment(date).format("LL")}
          classes={{ title: classes.title, subheader: classes.subheader }}
        />
        <CardContent className={classes.Content}>
          {this.getReport(report, data)}
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <Typography component="p" className={classes.description}>
            {description.slice(0, 50)} {description.length > 50 && "..."}
          </Typography>
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

export default withStyles(styles)(ReportThumbCard);
