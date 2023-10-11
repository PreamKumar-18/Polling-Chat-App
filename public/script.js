document.addEventListener("DOMContentLoaded", () => {
  const socket = io(); // Connect to the Socket.IO server
  const voteButton = document.getElementById("vote-button");
  const sendButton = document.getElementById("send-button");
  const chatInput = document.getElementById("chat-input");
  const chatHistory = document.getElementById("chat-history");
  const typingIndicator = document.getElementById("typing-indicator");
  const createPollButton = document.getElementById("create-poll-button");
  const pollQuestionInput = document.getElementById("poll-question");
  const option1Input = document.getElementById("option1");
  const option2Input = document.getElementById("option2");
  const pollQuestionDisplay = document.getElementById("poll-question-display");
  const option1Text = document.getElementById("option1-text");
  const option2Text = document.getElementById("option2-text");
  const option1CountDisplay = document.getElementById("option1-count");
  const option2CountDisplay = document.getElementById("option2-count");
  let activePoll = null;


  // Handle creating a new poll
  document.getElementById('option1-label').textContent = option1Input.value;
document.getElementById('option2-label').textContent = option2Input.value;


createPollButton.addEventListener('click', () => {
    const question = pollQuestionInput.value;
    const option1 = option1Input.value;
    const option2 = option2Input.value;
    

    if (question && option1 && option2  ) {
        // Emit the new poll to the server
        socket.emit('createPoll', { question, options: [option1, option2] });
        pollQuestionDisplay.textContent = question;
        option1Text.textContent = option1;
        option2Text.textContent = option2;
       
        activePoll = { question, options: [option1, option2] };
        pollQuestionInput.value = '';
        option1Input.value = '';
        option2Input.value = '';
       
    }
});

    // Update poll results when receiving data from the server
    
  

  const userName = prompt("Enter your name:");

  // Assuming you have three poll options and their initial counts are set to 0
  let option1Count = 0;
  let option2Count = 0;
  // Declare the option3Count variable
  function updateVoteCounts() {
    document.getElementById('option1-count').textContent = option1Count;
    document.getElementById('option2-count').textContent = option2Count;
    // document.getElementById('option3-count').textContent = option3Count;
}

  // Function to update the UI with the current vote counts
  voteButton.addEventListener('click', () => {
    // Check which option is selected
    const selectedOption = document.querySelector('input[name="poll-option"]:checked');

    if (selectedOption) {
        const selectedOptionId = selectedOption.id;

        // Increment the corresponding vote count
        if (selectedOptionId === 'option1-text') {
            option1Count++;
        } else if (selectedOptionId === 'option2-text') {
            option2Count++;
        } 

        // Update the UI with the new vote counts
        updateVoteCounts();

        // Emit the vote event to the server
        socket.emit('vote', selectedOptionId);
    } else {
        // Handle the case where no option is selected
        alert('Please select an option before voting.');
    }
});

// Initialize the UI with the initial vote counts
updateVoteCounts();

// Add event listeners for vote updates received from the server
socket.on('updatePollResults', (results) => {
  option1CountDisplay.textContent = `Option 1: ${results.option1Count}`;
  option2CountDisplay.textContent = `Option 2: ${results.option2Count}`;
});

  sendButton.addEventListener("click", () => {
    const message = chatInput.value;
    if (message.trim() !== "") {
      // Emit the chat message to the server
      socket.emit("chatMessage", { text: message, user: userName });

      // Clear the input field
      chatInput.value = "";
    }
  });

  // Event listener for handling received chat messages
  socket.on("chatMessage", (message) => {
    // Append the received message to the chat history
    const userName = message.user;
    const messageText = message.text;

    // Create a div element to display the message
    const messageElement = document.createElement("div");
    messageElement.textContent = `${userName}: ${messageText}`;

    chatHistory.appendChild(messageElement);

    // Hide the typing indicator when a message is received
    typingIndicator.style.display = "none";
  });

  // Event listener for chat input focus (typing indicator)
  chatInput.addEventListener("input", () => {
    // Show typing indicator when the user is typing
    if (chatInput.value.trim() !== "") {
      typingIndicator.style.display = "block";
    } else {
      typingIndicator.style.display = "none";
    }
  });

  // Initialize the UI with the initial vote counts
  updateVoteCounts();
});
