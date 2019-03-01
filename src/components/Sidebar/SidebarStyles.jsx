import { drawerWidth } from "../../layouts/RTLStyles";

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#343a40"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "center",
    color: "#a1a1a1!important"
  },
  item: {
    position: "relative",
    display: "block",
    color: "#a1a1a1!important",
    textDecoration: "none",
    "&:hover,&:focus,&:visited": {
      color: "#FFFFFF!important"
    }
  },
  activeItem: {
    backgroundColor: "rgb(0, 0, 0, 0.1)",
    color: "#fff"
  },
  itemIcon: {
    width: "24px",
    height: "30px",
    fontSize: "24px",
    lineHeight: "30px",
    float: "left",
    marginRight: "15px",
    textAlign: "center",
    verticalAlign: "middle",
    color: "#a1a1a1!important"
  },
  activeItemIcon: {
    color: "#fff!important"
  }
});

export default styles;
