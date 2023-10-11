To run this application, you'll need Node.js and the following dependencies:

Express
Socket.IO
You can install these dependencies using npm:

npm install express socket.io

Once you have the necessary dependencies, you can start the server using the following command:

node Server.js


Client-Side Code:

The client-side code is written in HTML, CSS, and JavaScript. Here are the key components on the client side:

HTML (index.html): This file contains the structure of the web page, including elements for creating and displaying polls, as well as a chat interface.

CSS (styles.css): This file contains the styles for the web page, including the appearance of the polls, chat, and other UI elements.

JavaScript (script.js): This script handles user interactions, such as voting in polls, sending chat messages, and displaying updates in real-time.

Server-Side Code:

The server-side code is written in Node.js. It uses the Express.js framework and Socket.IO for real-time communication. Here are the key components on the server side:

Server (server.js): This file sets up the Node.js server and handles WebSocket connections using Socket.IO. It also manages poll data and chat messages.
How It Works
Creating a Poll: Users can create a poll by entering a question and two options in the web interface. When they click the "Create Poll" button, the poll data is emitted to the server, and the poll question and options are displayed for all users.

Voting in a Poll: Users can vote in the active poll by selecting one of the options and clicking the "Vote" button. Their vote is emitted to the server, and the server updates the vote counts for each option, which are displayed in real-time.

Chat Feature: Users can send chat messages by entering text in the chat input field and clicking the "Send" button. The messages are emitted to the server and broadcast to all connected clients, allowing for real-time chat.


Thank you