const Event = require("../model/events.js");

// Create Event

const createEvent = async (req, res) => {
  try {
    const { datetime, eventType, description } = req.body;
    const event = new Event({
      datetime: formatDateTime(datetime),
      eventType,
      description,
    });
    // already exists
    const existingEvent = await Event.findOne({
      datetime: formatDateTime(datetime),
      eventType,
      description,
    });
    if (existingEvent) {
      return res.status(400).json({
        error: "Event already exists for the specified date",
      });
    }
    await event.save();
    res.send({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Event failed!" });
  }
};

function formatDateTime(inputDateTime) {
  const date = new Date(inputDateTime);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  const time = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return `${month}/${day}/${year} ${time}`;
}

// update event
const updateEvent = async (req, res) => {
  try {
    const { datetime, eventType, description } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
      datetime: formatDateTime(datetime),
      eventType,
      description,
    },
    {
      new: true,
    });
    

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: event,
    });
  
  }
   catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while updating event" });
  }
};
module.exports = {
  createEvent,
  updateEvent
};
