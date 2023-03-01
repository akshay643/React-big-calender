// Styles
import "react-big-calendar-like-google/lib/css/react-big-calendar.css";
// Packages
import React from "react";
import moment from "moment";
// Components
import BigCalendar from "react-big-calendar-like-google";
import EventModal from "../components/modals/EventModal";
// Contexts
import { useEventContext } from "../contexts/EventContext";

moment.locale("en");
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export default function Calender() {
  const { events, handleClickOpen } = useEventContext();

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col p-2">
            <EventModal />
          </div>
        </div>
      </div>
      <BigCalendar
        popup
        selectable
        events={events}
        defaultView="month"
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        onSelectEvent={(event) => {
          const data = {
            _id: event._id,
            title: event.title,
            description: event.description,
            bgColor: event.bgColor,
            start: event.start,
            end: event.end
          };
          handleClickOpen(data);
        }}
        onSelectSlot={(slotInfo) => {
          const data = {
            start: slotInfo.start,
            end: slotInfo.end
          };
          handleClickOpen(data);
        }}
      />
    </div>
  );
}
