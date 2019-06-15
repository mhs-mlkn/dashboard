import React from "react";
import { withRouter } from "react-router";
import { Subscribe } from "unstated";
import Tooltip from "@material-ui/core/Tooltip";
import Radio from "@material-ui/core/Radio";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import LayoutContainer from "../../containers/Layout.container";

const DashboardLinks = props => {
  const getSelectedDashboardId = () => {
    const urlParts = props.location.pathname.split("/");
    return urlParts[urlParts.length - 1];
  };

  const handleChange = e => {
    let newPath = "/user/dashboard";
    newPath += props.location.pathname.includes("/layout") ? "/layout" : "";
    return props.history.push(`${newPath}/${e.target.value}`);
  };

  const selectedDashboardId = getSelectedDashboardId();

  return (
    <Subscribe to={[LayoutContainer]}>
      {Layout => (
        <div style={{ flexGrow: 1, textAlign: "center", direction: "ltr" }}>
          {props.location.pathname.startsWith("/user/dashboard") ? (
            <>
              <span>
                {Layout.state.dashboards.length > 0 &&
                  Layout.getDashboardName(selectedDashboardId)}
              </span>
              {Layout.state.dashboards.map(d => (
                <Tooltip
                  title={`داشبورد ${d.name || d.id}`}
                  placement="top"
                  key={d.id}
                >
                  <Radio
                    name="dashboard-links"
                    value={d.id}
                    checked={+selectedDashboardId === d.id}
                    onChange={handleChange}
                    color={d.shared ? "secondary" : "default"}
                    icon={<RadioButtonUncheckedIcon fontSize="small" />}
                    checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                  />
                </Tooltip>
              ))}
            </>
          ) : null}
        </div>
      )}
    </Subscribe>
  );
};

export default withRouter(DashboardLinks);
