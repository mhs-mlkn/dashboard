import React, { useState } from "react";
import { Subscribe } from "unstated";
import Tooltip from "@material-ui/core/Tooltip";
import Radio from "@material-ui/core/Radio";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import ReportContainer from "../../containers/Report.container";

const DashboardLinks = ({ location }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleChange = e => setSelectedIndex(+e.target.value);

  return (
    <Subscribe to={[ReportContainer]}>
      {Report => (
        <div style={{ flexGrow: 1, textAlign: "center", direction: "ltr" }}>
          {location.pathname.startsWith("/user/dashboard")
            ? Report.state.dashboards.map((dash, index) => (
                <Tooltip title={`داشبورد ${index}`} placement="top">
                  <Radio
                    key={index}
                    name="dashboard-links"
                    value={index}
                    checked={selectedIndex === index}
                    onChange={handleChange}
                    color="default"
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

export default DashboardLinks;
