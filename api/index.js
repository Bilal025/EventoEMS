//! To start api -->  PowerShell -ExecutionPolicy Bypass nodemon

const express = require("express");
var cors = require("cors");
require("dotenv").config();
const { default: mongoose } = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10); //! To encriypt the password text ---
const jwtSecret = "bsbsfbrnsftentwnnwnwn"; //! JWT token secret code for encryption ---

//! Making a connection with backend and frontend (in my pc Backend runnig in PORT 4000 Frontend running in PORT 5173 )
app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:5173",
   })
);

mongoose.connect(process.env.MONGO_URL); //! Setting up the connection to mongoDB URL in .env file ---

//! Checking whether API is working --------------------------------------------------------
app.get("/test", (req, res) => {
   res.json("test ok");
});

//! Register page API endpoint -------------------------------------------------------------
app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
   } catch (e) {
      res.status(422).json(e);
   }
});

//! Login API endpoint checking whether database have the entered user profile ------------------------
app.post("/login", async (req, res) => {
   const { email, password } = req.body;

   const userDoc = await UserModel.findOne({ email });

   if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
   }

   const passOk = bcrypt.compareSync(password, userDoc.password);
   if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
   }

   //! User verified, create and send JWT token ----------------------------------------------------
   jwt.sign(
      {
         email: userDoc.email,
         id: userDoc._id,
      },
      jwtSecret,
      {},
      (err, token) => {
         if (err) {
            return res.status(500).json({ error: "Failed to generate token" });
         }
         res.cookie("token", token).json(userDoc);
      }
   );
});

//! API endpoint for User profile (This is for check purposes)-----------------------------------------------
app.get("/profile", (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
         if (err) throw err;
         const { name, email, _id } = await UserModel.findById(userData.id);
         res.json({ name, email, _id });
      });
   } else {
      res.json(null);
   }
});

//! Logout Functionality --------------------------------------------------------------------------
app.post("/logout", (req, res) => {
   res.cookie("token", "").json(true);
});

//!=======================  GET FROM DATABASE  ===========================================
//!DEMO FOR DEVELOPMENT PURPOSE------------------------


const eventSchema = new mongoose.Schema({
   owner: String,
   title: String,
   description: String,
   organizedBy: String,
   eventDate: Date,
   eventTime: String,
   location: String,
   ticketPrice: Number,
   image: String,
   likes: Number,
   Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);


//! API endpoint to create an event (This is for checking purpose) -----------------------------------------
app.post("/createEvent", async (req, res) => {
   try {
      const eventData = req.body;
      eventData.image = req.file ? req.file.path : "";
      const newEvent = new Event(eventData);
      await newEvent.save();
      res.status(201).json(newEvent);
   } catch (error) {
      res.status(500).json({ error: "Failed to save the event to MongoDB" });
   }
});

//! API endpoint to fetch all events for index page ----------------------------------------------------
app.get("/createEvent", async (req, res) => {
   try {
      const events = await Event.find();
      res.status(200).json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events from MongoDB" });
   }
});

//! API endpoint to fetch event by id for Event page ---------------------------------------
app.get("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

//! API endpoint to adding and fetch likes ---------------------------------------------------
app.post("/event/:eventId", (req, res) => {
   const eventId = req.params.eventId;

   Event.findById(eventId)
      .then((event) => {
         if (!event) {
            return res.status(404).json({ message: "Event not found" });
         }

         event.likes += 1;
         return event.save();
      })
      .then((updatedEvent) => {
         res.json(updatedEvent);
      })
      .catch((error) => {
         console.error("Error liking the event:", error);
         res.status(500).json({ message: "Server error" });
      });
});

//! Add a comment to an event (NOT IN USE) ------------------------------------------ 
app.post("/event/:eventId", (req, res) => {
   const eventId = req.params.eventId;
   const comment = req.body.comment;

   Event.findById(eventId)
      .then((event) => {
         if (!event) {
            return res.status(404).json({ message: "Event not found" });
         }
         event.comments.push(comment);
         return event.save();
      })
      .then((updatedEvent) => {
         res.json(updatedEvent);
      })
      .catch((error) => {
         console.error("Error adding comment:", error);
         res.status(500).json({ message: "Server error" });
      });
});

//! API endpoint to fetch event by id to calendar ------------------------------------------------------
app.get("/events", (req, res) => {
   Event.find()
     .then((events) => {
       res.json(events);
     })
     .catch((error) => {
       console.error("Error fetching events:", error);
       res.status(500).json({ message: "Server error" });
     });
 });

 //! API endpoint to fetch event by id to ordersummary - Apsara
 app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }

});

//! API endpoint to fetch event by id to paymentsummary - Apsara
app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
      try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});
 
 
app.listen(4000); //! the API listning point ---


