const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
// In-memory data structures
const pollOptions = {
  option1: { count: 0 },
  option2: { count: 0 },
  option3: { count: 0 },
};

const chatMessages = [];

// Handle CORS if needed
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Send current poll data to the connected user
  socket.emit("updatePollData", pollOptions);

  // Send chat history to the connected user
  socket.emit("chatHistory", chatMessages);

  // Handle chat messages
  socket.on("chatMessage", (message) => {
    const chatMessage = {
      text: message.text,
      user: message.user,
      timestamp: new Date(),
    };
    chatMessages.push(chatMessage);

    // Broadcast the message to all connected clients
    io.emit("chatMessage", chatMessage);

    // Limit chat history to the last 50 messages
    if (chatMessages.length > 50) {
      chatMessages.shift();
    }
  });

  // Handle poll votes
  let activePoll = null;

  // Handle creating a new poll
  socket.on("createPoll", (poll) => {
    activePoll = {
      question: poll.question,
      options: poll.options,
      option1Count: 0,
      option2Count: 0,
    };
    // Broadcast the new poll to all connected clients
    io.emit("newPoll", activePoll);
  });

  // Handle voting in the poll
  socket.on("vote", (option) => {
    if (activePoll) {
      console.log(`Received vote for ${option}`);
      if (option === "option1") {
        activePoll.option1Count++;
      } else if (option === "option2") {
        activePoll.option2Count++;
      }
      // Emit the updated vote counts
      io.emit("updatePollResults", {
        option1Count: activePoll.option1Count,
        option2Count: activePoll.option2Count,
      });
    }
  });

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
