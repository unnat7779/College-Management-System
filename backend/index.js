const connectToMongo = require("./database/db");
const express = require("express");
const app = express();
const path = require("path");
connectToMongo();

const port = 4000 || process.env.PORT;
require("dotenv").config(); // Make sure this is at the top if not already
const cors = require("cors");

const attendanceRoutes = require("./routes/attendance.route");


app.use(
  cors({
    origin: process.env.FRONTEND_API_LINK,
    credentials: true,
  })
);



app.use(express.json()); //to convert request data to json
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀");
});

app.use("/media", express.static(path.join(__dirname, "media")));

app.use("/api/admin", require("./routes/details/admin-details.route"));
app.use("/api/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/student", require("./routes/details/student-details.route"));

app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));

app.use("/api/attendance", require("./routes/attendance.route"));

app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
