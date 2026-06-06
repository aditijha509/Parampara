// import dotenv from "dotenv";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const itemRoutes = require("./routes/item.routes");
const pathRoutes = require("./routes/path.routes");
const progressRoutes = require("./routes/progress.routes");
const postRoutes = require("./routes/post.routes");
const chatRoutes = require("./routes/chat.routes");
const checkinRoutes = require("./routes/checkin.routes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const initializeSampleData = require("./config/sampleData");

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// Initialize Data
initializeSampleData();


// Home Route
app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );
});

// API Routes
app.use("/api/items", itemRoutes);

app.use("/api/paths", pathRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/checkin", checkinRoutes);
const MAPTILER_KEY = process.env.MAPTILER_KEY;
console.log(process.env.MAPTILER_KEY);

app.get("/api/map-style", async (req, res) => {

    const response = await fetch(
        `https://api.maptiler.com/maps/streets/style.json?key=${process.env.MAPTILER_KEY}`
    );
     console.log("MapTiler status:", response.status);

    const style = await response.json();
      console.log(style.version);
    console.log(style.sources);
    console.log(style.layers?.length);

    // res.json(style);

    res.json(style);
});


// 404 Middleware
app.use(notFound);

// Error Middleware
app.use(errorHandler);

//map key

//custom 404 route
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public", "404.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(
        `✨ Parampara server running on http://localhost:${PORT}`
    );
});