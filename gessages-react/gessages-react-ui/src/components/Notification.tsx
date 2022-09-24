import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import classes from "./Notification.module.css";

interface NotificationI {
  status: String;
  title: String;
  message: String;
}

const Notification = (props: NotificationI) => {
  let specialClasses = "";

  if (props.status === "error") {
    specialClasses = classes.error;
  }
  if (props.status === "success") {
    specialClasses = classes.success;
  }

  const cssClasses = `${classes.notification} ${specialClasses}`;
  return (
    <section className={cssClasses}>
      <h2>{props.title}</h2>
      <p>{props.message}</p>
    </section>
  );
};

export default Notification;
