import React, { useState, useEffect } from "react";
import { isEqual } from "lodash";
import MyCustomEvent from "../../../../util/customEvent";
import Dialog from "../../../../components/Dialog/Dialog";
import ConfigReport from "./ConfigReport";
import LayoutContainer from "../../../../containers/Layout.container";
import { CHART_CONFIG } from "../../../../constants";

const initialState = {
  open: false,
  userReport: "",
  config: {},
  loading: false,
  error: ""
};

const ConfigReportDialog = props => {
  const [state, setState] = useState(initialState);

  const handleConfigChange = config => {
    setState({
      ...state,
      config: {
        ...CHART_CONFIG[state.userReport.report.type],
        ...state.config,
        ...config
      }
    });
  };

  useEffect(() => {
    MyCustomEvent.on("CONFIG_REPORT", onOpenDialog);

    return function cleanup() {
      MyCustomEvent.removeEventListener("CONFIG_REPORT", onOpenDialog);
    };
  }, []);

  const onOpenDialog = userReport => {
    setState({
      ...state,
      userReport,
      config: {
        ...CHART_CONFIG[userReport.report.type],
        ...LayoutContainer.getSettings(props.dashboardId, userReport.id)
      },
      open: true
    });
  };

  const handleClose = () => {
    setState({ ...state, userReport: "", open: false });
  };

  const handleOnSave = async () => {
    const settings = {
      ...CHART_CONFIG[state.userReport.report.type],
      ...LayoutContainer.getSettings(props.dashboardId, state.userReport.id)
    };

    if (isEqual(state.config, settings) === false) {
      props.onSettingsChange(state.userReport.id, state.config);
    }
    setState({ ...state, userReport: "", loading: false, open: false });
  };

  if (!state.open) {
    return null;
  }

  return (
    <Dialog
      title={`تنظیم گزارش: ${state.userReport.report.name}`}
      open={state.open}
      loading={state.loading}
      maxWidth="lg"
      error={state.error}
      onSave={handleOnSave}
      onClose={handleClose}
    >
      <ConfigReport
        userReport={state.userReport}
        config={state.config}
        onConfigChange={handleConfigChange}
      />
    </Dialog>
  );
};

export default ConfigReportDialog;
