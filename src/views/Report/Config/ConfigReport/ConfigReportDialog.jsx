import React, { useState, useEffect } from "react";
import MyCustomEvent from "../../../../util/customEvent";
import Dialog from "../../../../components/Dialog/Dialog";
import ConfigReport from "./ConfigReport";
import Layoutcontainer from "../../../../containers/Layout.container";
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

  const handleConfigChange = config =>
    setState({
      ...state,
      config: {
        ...CHART_CONFIG[state.userReport.report.type],
        ...state.config,
        ...config
      }
    });

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
        ...Layoutcontainer.state.dashboards[props.dashboardIndex].config
          .settings[userReport.id]
      },
      open: true
    });
  };

  const handleClose = () => {
    setState({ ...state, userReport: "", open: false });
  };

  const handleOnSave = async () => {
    setState({ ...state, loading: true });
    await Layoutcontainer.onSettingsChange(
      props.dashboardIndex,
      state.userReport.id,
      state.config
    );
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
