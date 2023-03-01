// context/todoContext.tsx
import * as React from "react";
import {
  createEvent,
  fetchEvents,
  deleteEvent,
  updateEvent
} from "../utils/api";

export const EventContext = React.createContext();

const reformatItems = (events) => {
  return events.map(function (event) {
    var newObj = {};
    newObj["_id"] = event._id;
    newObj["title"] = event.title;
    newObj["bgColor"] = event.bgColor;
    newObj["description"] = event.description;
    newObj["hours"] = event.hours;
    newObj["start"] = new Date(Date.parse(event.start))
      .toISOString()
      .slice(0, 16);
    newObj["end"] = new Date(Date.parse(event.end)).toISOString().slice(0, 16);
    return newObj;
  });
};

const fixDatesAsIso = (event) => {
  const starter = new Date(Date.parse(event.start));
  starter.setMinutes(starter.getMinutes() - starter.getTimezoneOffset());
  const ender = new Date(Date.parse(event.end));
  ender.setMinutes(ender.getMinutes() - ender.getTimezoneOffset());

  return {
    start: starter.toISOString().slice(0, 16),
    end: ender.toISOString().slice(0, 16)
  };
};

const fixDatesAsTimestamps = (event) => {
  const starter = new Date(Date.parse(event.start));
  starter.setMinutes(starter.getMinutes() - starter.getTimezoneOffset());
  const ender = new Date(Date.parse(event.end));
  ender.setMinutes(ender.getMinutes() - ender.getTimezoneOffset());

  return {
    start: Date.parse(starter),
    end: Date.parse(ender)
  };
};

const EventProvider = ({ children }) => {
  const [events, setEvents] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = React.useState({
    _id: "",
    title: "",
    description: "",
    start: null,
    end: null,
    bgColor: ""
  });
  const [open, setOpen] = React.useState(false);
  const [formType, setFormType] = React.useState("");

  const handleClickOpen = (event = null) => {
    try {
      setOpen(true);
      if (event === null) {
        // Create New Event
        setFormType("add");
      } else if (
        event.hasOwnProperty("start") &&
        event.hasOwnProperty("end") &&
        !event.hasOwnProperty("title") &&
        !event.hasOwnProperty("description")
      ) {
        // Timeslot Select
        setFormType("add");
        const stamps = fixDatesAsIso(event);
        setSelectedEvent(stamps);
        console.log("timeslot", stamps);
      } else {
        // Select Existing
        const stamps = fixDatesAsTimestamps(event);
        setSelectedEvent({ ...stamps, ...event });
        console.log("selectExisting", selectedEvent);
        setFormType("show");
      }
    } catch (e) {
      alert("handleClickOpen: ", e);
    }
  };

  const handleClose = () => {
    setFormType("");
    setSelectedEvent(null);
    setOpen(false);
  };

  const init = async () => {
    try {
      const events = await fetchEvents();
      const newItems = reformatItems(events);
      console.log("init: ", newItems);
      setEvents(newItems);
    } catch (e) {
      alert(e);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const saveEvent = async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      bgColor: data.bgColor,
      start: data.start,
      end: data.end
    };
    const adjustPayload = fixDatesAsTimestamps(payload);
    const newEvent = await createEvent({ ...adjustPayload, ...payload });
    const reformatItem = reformatItems([newEvent.event]);
    if (newEvent.success) {
      setEvents([
        ...events,
        {
          ...reformatItem[0]
        }
      ]);
    }
    return newEvent;
  };

  const editEvent = async (data) => {
    const res = await updateEvent(selectedEvent._id, data);
    const reformatItem = fixDatesAsTimestamps(res.event);
    const foundEvent = events.filter((event) => {
      if (event._id === res.event._id) {
        const newObject = { ...reformatItem, ...event };
        const index = events.indexOf(event);
        events.splice(index, 1);
        setEvents([...events, newObject]);
      }
    });
    if (foundEvent) {
      handleClose();
      init();
    }
    return reformatItem;
  };

  const removeEvent = async () => {
    const newEvent = await deleteEvent(selectedEvent._id);
    if (newEvent.success) {
      handleClose();
      init();
    }
    return newEvent;
  };

  return (
    <EventContext.Provider
      value={{
        events,
        open,
        saveEvent,
        editEvent,
        removeEvent,
        handleClickOpen,
        handleClose,
        selectedEvent,
        setSelectedEvent,
        formType,
        setFormType
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;

export function useEventContext() {
  return React.useContext(EventContext);
}
