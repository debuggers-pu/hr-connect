const Event = require("../model/events.js");
const User = require("../model/user.js");

// Create Event

const createEvent = async (req, res) => {
  try {
    const { datetime, eventType, description } = req.body;
    if (eventType !== "public" && eventType !== "private") {
      return res.status(400).json({
        error: "Invalid eventType. It must be 'public' or 'private'.",
      });
    }
    const event = new Event({
      user: req.user.id,
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
    // push to all users if it is public event
    if (eventType === "public") {
      const users = await User.find();
      users.forEach(async (user) => {
        user.events.push(event);
        await user.save();
      });
    }
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

// update event according to event type private, public

const updateEvent = async (req, res) => {
  try {
    const { datetime, eventType, description } = req.body;
    const eventId = req.params.id;
    const userId = req.user.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(400).json({
        error: "Event does not exist",
      });
    }

    // Check if the user has permission to update the event
    if (!event.user || event.user.toString() !== userId) {
      return res.status(403).json({
        error: "You do not have permission to update this event",
      });
    }

    event.datetime = formatDateTime(datetime);
    event.eventType = eventType;
    event.description = description;
    await event.save();

    res.send({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Event failed!" });
  }
};

// get all events according to event type private, public

const getAllEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const event = req.params.id;
    // if it is public event push to all users 
    
    if (event === "public") {
      const publicEvents = await Event.find({ eventType: "public" });
      return res.send({
        message: "Public Events",
        publicEvents,
      });
    }
    const privateEvents = await Event.find({
      eventType: "private",
      user: userId,
    });
    res.send({
      message: "Private Events",
      privateEvents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Event failed!" });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
};
