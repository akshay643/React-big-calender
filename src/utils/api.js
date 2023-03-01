import axios from "axios";
import { access_token } from "../config";

const APP_ENV = "development";
const HOST =
  APP_ENV === "development"
    ? "https://975f-99-36-3-176.ngrok.io"
    : "https://ts-dev-api.glootie.ml";

axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

export async function fetchEvents(timeInfo = null) {
  let res;
  if (timeInfo === null) {
    res = await axios.get(`${HOST}/api/v1/events`);
  } else {
    res = await axios.get(`${HOST}/api/v1/events`, timeInfo);
  }
  const events = res.data.events;
  console.log("fetchEvents: ", events);
  return events;
}

export async function createEvent(eventInput) {
  const res = await axios.post(`${HOST}/api/v1/events`, eventInput);
  const event = res.data;
  console.log("createEvent: ", event);
  return event;
}

export async function showEvent(id) {
  const res = await axios.get(`${HOST}/api/v1/events/${id}`);
  const event = res.data;
  console.log("showEvent: ", event);
  return event;
}

export async function updateEvent(id, eventInput) {
  const res = await axios.put(`${HOST}/api/v1/events/${id}`, eventInput);
  const event = res.data;
  console.log("updateEvent: ", event);
  return event;
}

export async function deleteEvent(id) {
  const res = await axios.delete(`${HOST}/api/v1/events/${id}`);
  const event = res.data;
  console.log(`deletedEvent: ${id}`);
  return event;
}
