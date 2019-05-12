import React from "react";
import { withRouter } from "react-router";
import { Subscribe } from "unstated";
import Tooltip from "@material-ui/core/Tooltip";
import Radio from "@material-ui/core/Radio";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import LayoutContainer from "../../containers/Layout.container";

const DashboardLinks = props => {
  const getIndex = () => {
    const urlParts = props.location.pathname.split("/");
    return urlParts[urlParts.length - 1];
  };

  const handleChange = e => {
    let newPath = "/user/dashboard";
    newPath += props.location.pathname.includes("/layout") ? "/layout" : "";
    return props.history.push(`${newPath}/${e.target.value}`);
  };

  const selectedIndex = getIndex();

  return (
    <Subscribe to={[LayoutContainer]}>
      {Layout => (
        <div style={{ flexGrow: 1, textAlign: "center", direction: "ltr" }}>
          {props.location.pathname.startsWith("/user/dashboard")
            ? Layout.state.dashboards.map((d, index) => (
                <Tooltip title={`داشبورد ${index}`} placement="top" key={index}>
                  <Radio
                    name="dashboard-links"
                    value={index}
                    checked={+selectedIndex === index}
                    onChange={handleChange}
                    color={d.shared ? "secondary" : "default"}
                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                  />
                </Tooltip>
              ))
            : null}
        </div>
      )}
    </Subscribe>
  );
};

export default withRouter(DashboardLinks);
