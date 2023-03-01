import { render } from "react-dom";
import React, { Component } from "react";
import Calendar from "./components/Calendar";
import EventProvider from "./contexts/EventContext";

class App extends Component {
  render() {
    return (
      <EventProvider>
        <Calendar />
      </EventProvider>
    );
  }
}

render(<App />, document.getElementById("app"));
