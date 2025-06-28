require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 2112;

// Global middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// DB connection and table schemas
const dbConnection = require("./Db/dbConfig");
const {
  users,
  questions,
  answers,
  createAnswerVotes,
  createAnswerComments,
} = require("./Table/schema");

// Routes
const userRoutes = require("./Routes/userRoute");
const questionRoutes = require("./Routes/questionRoute");
const answersRoute = require("./Routes/answerRoute");

// Route middleware
app.use("/api/users", userRoutes);
app.use("/api/answer", answersRoute);
app.use("/api/question", questionRoutes);
app.use("/api/answer/:answerid", answersRoute);

// ✅ Default route to confirm server is live
app.get("/", (req, res) => {
  res.send("✅ Evangadi Forum API is running!");
});

// Start server and create tables
async function start() {
  let dbConnected = false;

  try {
    await dbConnection.query("SELECT 'test'"); // Test DB connection
    dbConnected = true;

    // Create tables
    await dbConnection.query(users);
    await dbConnection.query(questions);
    await dbConnection.query(answers);
    await dbConnection.query(createAnswerVotes);
    await dbConnection.query(createAnswerComments);
  } catch (error) {
    console.log(
      "⚠️ Starting server without database connection for testing..."
    );
  }

  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
    if (!dbConnected) {
      console.log(
        " Note: Database is not connected. Some features may not work."
      );
    }
  });
}

start();
