import React from "react";
import { withRouter } from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import { Subscribe } from "unstated";
import TimerContainer from "../containers/Timer.container";

// let _isPaused = false;

class CircularDeterminate extends React.Component {
  state = {
    completed: 0
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 1000);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ completed: 0 }, () => {
        if (this.timer) {
          clearInterval(this.timer);
        }
        if (!TimerContainer.state.paused) {
          this.timer = setInterval(this.progress, 1000);
        }
      });
    }
  };

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  progress = () => {
    const { completed } = this.state;
    const { changeInterval } = this.props;
    this.setState({ completed: completed + 100 / changeInterval });
  };

  handleButtonClick = async () => {
    this.setState({ completed: 0 });
    TimerContainer.toggle().then(() => {
      if (TimerContainer.state.paused) {
        clearInterval(this.timer);
      } else {
        this.timer = setInterval(this.progress, 1000);
      }
    });
  };

  render() {
    return (
      <Subscribe to={[TimerContainer]}>
        {Timer => (
          <div style={{ position: "relative" }}>
            <Fab
              color="primary"
              onClick={this.handleButtonClick}
              size="small"
              style={{ zIndex: "100" }}
            >
              {Timer.state.paused ? <PlayArrowIcon /> : <PauseIcon />}
            </Fab>
            <CircularProgress
              variant="static"
              value={this.state.completed}
              color="primary"
              size={52}
              style={{ position: "absolute", top: -6, left: -6, zIndex: 1 }}
            />
          </div>
        )}
      </Subscribe>
    );
  }
}

export default withRouter(CircularDeterminate);
