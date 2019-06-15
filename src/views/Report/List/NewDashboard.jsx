import React from "react";
import { Formik, Form } from "formik";
import Input from "../../../components/FormikInputs";
import LayoutContainer from "../../../containers/Layout.container";

const NewDashboard = props => {
  const submit = () => {};

  const renderForm = formikProps => {
    return (
      <Form autoComplete="off">
        <Input
          name="name"
          label="نام داشبورد جدید"
          {...formikProps}
          handleChange={e => {
            LayoutContainer.setNewDashboardName(e.target.value);
            formikProps.handleChange(e);
          }}
        />
      </Form>
    );
  };

  return (
    <Formik
      initialValues={{ name: "" }}
      enableReinitialize
      render={renderForm}
      onSubmit={submit}
    />
  );
};

export default NewDashboard;
