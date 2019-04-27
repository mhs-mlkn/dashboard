import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { SketchPicker as ColorPicker } from "react-color";

const popover = {
  position: "absolute",
  zIndex: "2"
};
const cover = {
  position: "fixed",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px"
};

const ScalarConfigt = props => {
  const { config, onConfigChange } = props;

  const [prop, setProp] = useState("mainBackground");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const toggleDisplay = prop => {
    setProp(prop);
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleChange = override => {
    onConfigChange({ ...config, ...override });
  };

  return (
    <Grid container direction="column" spacing={16}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => toggleDisplay("mainBackground")}
        >
          پس زمینه اصلی
        </Button>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => toggleDisplay("infoBackground")}
        >
          پس زمینه متن
        </Button>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => toggleDisplay("textColor")}
        >
          متن
        </Button>
      </Grid>
      {displayColorPicker ? (
        <div style={popover}>
          <div style={cover} onClick={() => toggleDisplay("")} />
          <ColorPicker
            color={config[prop]}
            onChangeComplete={({ hex }) => handleChange({ [prop]: hex })}
          />
        </div>
      ) : null}
    </Grid>
  );
};

export default ScalarConfigt;
