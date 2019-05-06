import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import Loading from "../../../components/Loading/Loading";

const LoadMore = props => {
  const { loading, count, totalCount, onLoadMore } = props;
  return loading ? (
    <Loading />
  ) : (
    count < totalCount && (
      <IconButton
        color="secondary"
        size="small"
        className={"load-more"}
        onClick={onLoadMore}
      >
        <MoreHoriz fontSize="small" />
      </IconButton>
    )
  );
};

export default LoadMore;
