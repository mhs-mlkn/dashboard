import { Container } from "unstated";

export class LoadingContainer extends Container {
  state = {
    loading: false
  };

  setLoading = loading => this.setState({ loading });

  toggle = () =>
    this.setState(state => ({
      loading: !state.loading
    }));
}

const container = new LoadingContainer();

export default container;
