import { Container } from "unstated";

const THEME_TYPE = "DASH_THEME_TYPE";

export class ThemeContainer extends Container {
  state = {
    type: localStorage.getItem(THEME_TYPE) || "light"
  };

  toggle = async () => {
    const { type } = this.state;
    const newType = type === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_TYPE, newType);
    return this.setState({ type: newType });
  };
}

const container = new ThemeContainer();

export default container;
