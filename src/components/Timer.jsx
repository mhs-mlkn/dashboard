import React from "react";
import { withRouter } from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import MyCustomEvent from "../util/customEvent";

class CircularDeterminate extends React.Component {
  state = {
    completed: 0,
    isPaused: false
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 1000);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ completed: 0, isPaused: false }, () => {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(this.progress, 1000);
      });
    }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { completed } = this.state;
    const { changeInterval } = this.props;
    this.setState({ completed: completed + 100 / changeInterval });
  };

  handleButtonClick = () => {
    this.setState(
      ({ isPaused }) => ({ isPaused: !isPaused, completed: 0 }),
      () => {
        MyCustomEvent.emit("TOGGLE_DASHBOARD_INTERVAL", this.state.isPaused);
        if (this.state.isPaused) {
          clearInterval(this.timer);
        } else {
          this.timer = setInterval(this.progress, 1000);
        }
      }
    );
  };

  render() {
    return (
      <div style={{ position: "relative" }}>
        <Fab
          color="primary"
          onClick={this.handleButtonClick}
          size="small"
          style={{ zIndex: "100" }}
        >
          {/* {(this.props.changeInterval - this.state.completed * 0.6).toFixed()} */}
          {this.state.isPaused ? <PlayArrowIcon /> : <PauseIcon />}
        </Fab>
        <CircularProgress
          variant="static"
          value={this.state.completed}
          color="primary"
          size={52}
          style={{ position: "absolute", top: -6, left: -6, zIndex: 1 }}
        />
        {/* {loading && (
          <CircularProgress size={68} className={classes.fabProgress} />
        )} */}
      </div>
    );
  }
}

export default withRouter(CircularDeterminate);
