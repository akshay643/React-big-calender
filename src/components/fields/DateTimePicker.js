import React from "react";
import "../../index.scss";

export default function DateTimePicker(props) {
  return (
    <div className="container">
      <div className="material-textfield">
        <input type="datetime-local" />
        <label>{props.title}</label>
      </div>
    </div>
  );
}
