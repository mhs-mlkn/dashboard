const styles = theme => ({
  drawer: {
    width: 240,
    flexShrink: 0
  },
  drawerPaper: {
    width: 240,
    backgroundColor: "#343a40"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "center",
    color: "#fff!important"
  },
  item: {
    position: "relative",
    display: "block",
    color: "#fff!important",
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
    marginRight: "0px",
    textAlign: "center",
    verticalAlign: "middle",
    color: "#fff!important"
  },
  activeItemIcon: {
    color: "#fff!important"
  }
});

export default styles;
