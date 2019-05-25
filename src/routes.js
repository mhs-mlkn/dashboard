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
    url: "/user/dashboard",
    matchTest: path => RegExp("/user/dashboard/\\d+", "g").test(path),
    component: Dashboard,
    icon: DashboardIcon
  },
  {
    title: "داشبورد",
    path: "/user/dashboard/:dashboardId(\\d+)",
    matchTest: path => RegExp("/user/dashboard/\\d+", "g").test(path),
    component: Dashboard,
    icon: DashboardIcon,
    invisible: true
  },
  {
    title: "لیست گزارشات",
    path: "/user/reports",
    matchTest: path => path.startsWith("/user/reports"),
    component: ReportList,
    icon: ListIcon
  },
  {
    title: "مقداردهی پارامترها",
    path: "/user/reports/:id/config/params/:dashboardId(\\d+)",
    matchTest: path => path.startsWith("/user/reports"),
    component: ReportParams,
    icon: SettingsIcon,
    invisible: true
  },
  {
    title: "تنظیمات داشبورد",
    path: "/user/dashboard/layout",
    url: "/user/dashboard/layout",
    matchTest: path => path.startsWith("/user/dashboard/layout"),
    component: DashboardLayout,
    icon: AspectRatioIcon
  },
  {
    title: "تنظیمات داشبورد",
    path: "/user/dashboard/layout/:dashboardId(\\d+)",
    matchTest: path => RegExp("/user/dashboard/layout/\\d+", "g").test(path),
    component: DashboardLayout,
    icon: AspectRatioIcon,
    invisible: true
  }
];
