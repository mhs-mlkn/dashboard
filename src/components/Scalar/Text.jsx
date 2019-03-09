import React from "react";
import { withSize } from "react-sizeme";
import { withStyles } from "@material-ui/core/styles";
import Info from "@material-ui/icons/Info";

const styles = theme => ({
  box: {
    position: "relative",
    borderRadius: ".2rem",
    backgroundColor: "#424951",
    // marginBottom: "1.5rem",
    border: "0",
    boxShadow: "0 0 2px rgba(0,0,0,.15)"
  },
  boxTop: {
    height: "100px",
    padding: "32px 15px",
    fontSize: "40px",
    lineHeight: "40px",
    textAlign: "center",
    fontWeight: "300"
  },
  boxInfo: {
    position: "absolute",
    width: "100%",
    marginTop: "-15px",
    textAlign: "center"
  },
  boxInfoSpan: {
    backgroundColor: "#3a4047",
    height: "30px",
    display: "inline-block",
    padding: "8px 20px",
    textTransform: "uppercase",
    lineHeight: "14px",
    border: "1px solid rgba(0,0,0,.15)",
    borderRadius: "1em"
  },
  boxBottom: {
    borderTop: "1px solid rgba(0,0,0,.15)",
    // height: "0px",
    // paddingTop: "0px",
    padding: "32px 15px",
    fontSize: "40px",
    lineHeight: "40px",
    textAlign: "center",
    fontWeight: "300"
  }
});

const ScalarText = props => {
  const { data, height, aspect = 0, size, classes } = props;
  const [title, value] = data;
  return (
    <div
      className={classes.box}
      style={{ height: aspect ? size.width / aspect : height || "100%" }}
    >
      <div className={classes.boxTop}>
        <span>{value}</span>
      </div>
      <div className={classes.boxInfo}>
        <span className={classes.boxInfoSpan}>{title}</span>
      </div>
      <div className={classes.boxBottom}>
        <Info style={{ fontSize: "75px" }} color="primary" />
      </div>
    </div>
  );
};

const WithSize = withSize()(ScalarText);

export default withStyles(styles)(WithSize);
