import { Container } from "unstated";

export class TimerContainer extends Container {
  state = {
    paused: true,
    hasSwitched: false
  };

  pause = () => this.setState({ paused: true });

  start = () => this.setState({ paused: false });

  setPaused = paused => this.setState({ paused });

  toggle = () => {
    return this.setState(state => ({
      paused: !state.paused,
      hasSwitched: true
    }));
  };

  reset = () => this.setState({ hasSwitched: false });
}

const container = new TimerContainer();

export default container;
