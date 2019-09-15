import React from "react";
import { Subscribe } from "unstated";
import Grid from "@material-ui/core/Grid";
import ReportThumb from "./ReportThumb";
import LoadMore from "./LoadMore";
import ReportContainer from "../../../containers/Report.container";

const GridView = props => {
  const { loading, page, navigate } = props;

  const handleChangePage = () => props.onChangePage(page + 1);

  return (
    <Subscribe to={[ReportContainer]}>
      {Report => (
        <>
          {Report.state.reports.map(report => (
            <Grid item key={report.id} xs={12} sm={6} lg={4} xl={3}>
              <ReportThumb report={report} navigate={navigate} />
            </Grid>
          ))}
          {Report.state.reports.length > 0 && (
            <LoadMore
              loading={loading}
              count={Report.state.reports.length}
              totalCount={Report.state.totalCount}
              onLoadMore={handleChangePage}
            />
          )}
        </>
      )}
    </Subscribe>
  );
};

export default GridView;
