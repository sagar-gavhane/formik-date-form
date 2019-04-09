import React from "react";
import ReactDOM from "react-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import moment from "moment";
import _ from "lodash";
import "./style.css";

let currentDate = moment().toISOString(true);
let sixMonthDate = moment()
  .subtract(6, "months")
  .toISOString(true);

const appendPadZero = str => ("" + str).padStart(2, "0");

const allowNumberKey = e => {
  if (e.which >= 48 && e.which <= 57) {
    return;
  } else {
    e.preventDefault();
  }
};

const DateForm = props => {
  return (
    <Formik
      validateOnBlur={false}
      initialValues={{
        day: "",
        month: "",
        year: ""
      }}
      validate={values => {
        let errors = {};

        const { day, month, year } = values;
        const formattedDate = `${appendPadZero(day)}-${appendPadZero(
          month
        )}-${year}`;
        const date = moment(formattedDate, "DD-MM-YYYY", true);

        if (!date.isValid()) {
          if (day === "" || month === "" || year === "") {
            errors.date = "Date is a required field.";
          } else {
            errors.date = "Please enter a valid date.";
          }
        } else if (date.isAfter(currentDate)) {
          errors.date = "Future date not accepted.";
        } else if (date.isBefore(sixMonthDate)) {
          errors.date = "Before six month date not accepted.";
        }

        return errors;
      }}
      validationSchema={yup.object().shape({
        date: yup.string()
      })}
      onSubmit={() => {
        alert("form submitted !!");
      }}
    >
      {formikProps => {
        return (
          <Form>
            <Field
              type="number"
              name="day"
              min="1"
              max="31"
              onChange={e => {
                const { value: day } = e.target;

                if (day >= 0 && day <= 31) {
                  formikProps.handleChange(e);
                }
              }}
              placeholder="DD"
              onKeyPress={e => {
                allowNumberKey(e);
              }}
            />
            <Field
              type="number"
              name="month"
              min="1"
              max="12"
              placeholder="MM"
              onChange={e => {
                const { value: month } = e.target;

                if (month >= 0 && month <= 12) {
                  formikProps.handleChange(e);
                }
              }}
              onKeyPress={e => {
                allowNumberKey(e);
              }}
            />
            <Field
              type="number"
              name="year"
              placeholder="YYYY"
              onChange={e => {
                const { value: year } = e.target;

                if (year >= 0 && year <= 2100) {
                  formikProps.handleChange(e);
                }
              }}
              onKeyPress={e => {
                allowNumberKey(e);
              }}
            />
            <button type="submit">Submit</button>
            {formikProps.errors.date && (
              <p className="red">{formikProps.errors.date}</p>
            )}
            <pre>
              {JSON.stringify(
                _.pick(formikProps, ["values", "touched", "errors"]),
                null,
                2
              )}
            </pre>
          </Form>
        );
      }}
    </Formik>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<DateForm />, rootElement);
