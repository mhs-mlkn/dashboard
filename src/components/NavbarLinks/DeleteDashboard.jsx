import React, { useState } from "react";
import { Subscribe } from "unstated";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ConfirmDialog from "../Dialog/ConfirmDialog";
import MyCustomEvent from "../../util/customEvent";
import Container from "../../containers/DeleteDashboard.container";

const DeleteDashboard = props => {
  const [openConfirm, toggleConfirm] = useState(false);

  const handleDeleteDashboard = async () => {
    toggleConfirm(false);
    await Container.setLoading(true);
    MyCustomEvent.emit("DELETE_DASHBOARD");
  };

  const handleToggleConfirm = () => toggleConfirm(!openConfirm);

  return (
    <Subscribe to={[Container]}>
      {store => (
        <div style={{ position: "relative" }}>
          <ConfirmDialog
            title="آیا اطمینان دارید؟"
            handleConfirm={handleDeleteDashboard}
            handleClose={handleToggleConfirm}
            open={openConfirm}
          />
          <IconButton
            onClick={handleToggleConfirm}
            color="secondary"
            title="حذف داشبورد"
          >
            <DeleteIcon />
          </IconButton>
          {store.state.loading && (
            <CircularProgress
              color="primary"
              size={36}
              style={{ position: "absolute", top: 6, left: 6, zIndex: 1 }}
            />
          )}
        </div>
      )}
    </Subscribe>
  );
};

export default DeleteDashboard;
