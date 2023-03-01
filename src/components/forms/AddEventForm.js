import React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Grid,
  Button
} from "@material-ui/core";
import "../../index.scss";

import { useEventContext } from "../../contexts/EventContext";

export default function AddEventForm() {
  const { saveEvent, handleClose, selectedEvent } = useEventContext();

  const [title, setTitle] = React.useState("");
  const [description, setDesc] = React.useState("");
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null);

  const submit = async () => {
    try {
      const sent = await saveEvent({
        title,
        description,
        start,
        end
      });
      if (sent.success) {
        setTitle("");
        setDesc("");
        setStart(null);
        setEnd(null);
        handleClose();
      }
    } catch (e) {
      alert(e);
    }
  };

  React.useEffect(() => {
    if (selectedEvent) {
      setStart(selectedEvent.start);
      setEnd(selectedEvent.end);
    }
  }, [selectedEvent]);

  return (
    <div>
      <DialogTitle>Create Event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This modal is used for creating new calendar events.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Title"
              type="email"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              dense
              fullWidth
              variant="outlined"
              label="Description"
              placeholder="Enter event description"
              multiline
              rows={2}
              maxRows={3}
              value={description}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <div className="container">
              <div className="material-textfield">
                <input
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  type="datetime-local"
                />
                <label>Start</label>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="container">
              <div className="material-textfield">
                <input
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  type="datetime-local"
                />
                <label>End</label>
              </div>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={submit}>Submit</Button>
      </DialogActions>
    </div>
  );
}
