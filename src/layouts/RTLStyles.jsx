export const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    backgroundColor: "#424951",
    color: "#a1a1a1",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 12,
    marginLeft: 20
  },
  menuButtonOpen: {
    marginRight: -12
  },
  hide: {
    display: "none"
  },
  content: {
    position: "relative",
    backgroundColor: "#3a4047",
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: process.env.NODE_ENV === "production" ? 0 : -drawerWidth,
    marginTop: theme.mixins.toolbar.minHeight,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px )`,
    overflow: "auto",
    [theme.breakpoints.down("sm")]: {
      marginRight: "0"
    }
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: process.env.NODE_ENV === "production" ? drawerWidth : 0
  }
});

export default styles;
