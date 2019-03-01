import Login from "./views/Login/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import ReportList from "./views/Report/List/List";

import DashboardIcon from "@material-ui/icons/Dashboard";
import ListIcon from "@material-ui/icons/List";

export const loginRoute = {
  title: "ورود",
  path: "/user/login",
  component: Login,
  invisible: true
};

export default [
  {
    title: "داشبورد",
    path: "/user/dashboard",
    component: Dashboard,
    icon: DashboardIcon
  },
  {
    title: "لیست گزارشات",
    path: "/user/reports",
    component: ReportList,
    icon: ListIcon
  }
];
