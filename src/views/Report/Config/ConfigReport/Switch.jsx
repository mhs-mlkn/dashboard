import React from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const ChartStackedConfig = props => {
  const { name, label, value, onChange } = props;

  const handleChange = ({ target }) => {
    onChange({ [name]: target.checked });
  };

  return (
    <FormControlLabel
      control={<Switch checked={value} onChange={handleChange} />}
      label={label}
    />
  );
};

export default ChartStackedConfig;
