import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

const styles = {
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1,
    paddingRight: 2
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
};

function CustomizedInputBase(props) {
  const { onSearch, initialValue = "", classes } = props;
  const [value, setValue] = useState(initialValue);

  const handleSearchClicked = () => {
    onSearch(value);
  };

  const handleClearValue = () => {
    if (value) {
      setValue("");
      onSearch("");
    }
  };

  const handleChangeValue = e => {
    setValue(e.target.value);
  };

  return (
    <Paper className={classes.root} elevation={1}>
      <InputBase
        placeholder="جستجو"
        value={value}
        onChange={handleChangeValue}
        className={classes.input}
      />
      <IconButton
        className={classes.iconButton}
        aria-label="حذف"
        onClick={handleClearValue}
      >
        <ClearIcon />
      </IconButton>
      <Divider className={classes.divider} />
      <IconButton
        color="primary"
        className={classes.iconButton}
        aria-label="جستجو"
        onClick={handleSearchClicked}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

CustomizedInputBase.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedInputBase);
