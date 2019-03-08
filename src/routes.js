import Login from "./views/Login/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import ReportList from "./views/Report/List/List";
import ReportParams from "./views/Report/Config/Params";
import DashboardLayout from "./views/Report/Config/Layout";

import DashboardIcon from "@material-ui/icons/Dashboard";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";

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
  },
  {
    title: "مقداردهی پارامترها",
    path: "/user/reports/:id/config/params",
    component: ReportParams,
    icon: SettingsIcon,
    invisible: true
  },
  {
    title: "تنظیم داشبورد",
    path: "/user/dashboard/layout",
    component: DashboardLayout,
    icon: AspectRatioIcon
  }
];
