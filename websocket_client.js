const WebSocket = require("ws");

// Connect to the WebSocket server
const socket = new WebSocket("ws://localhost:3000/ws");

// Define an array of strings to send as a stream
const streamData = [
  "axyw",
  "mjzm",
  "oztf",
  "fhkm",
  "aodd",
  "mgbg",
  "vinc",
  "xmqq",
  "phyw",
  "zzbf",
  "esaf",
  "nowd",
  "crnu",
  "psqb",
  "ujjy",
  "udrb",
  "jdgy",
  "prfw",
  "xrrp",
  "jfly",
  "rdcp",
  "vxul",
  "ouze",
  "tgai",
  "tibg",
  "zwha",
  "poxg",
  "ouvp",
  "prdc",
  "jhum",
  "pbjl",
  "tncj",
  "ybqs",
  "veln",
  "izfg",
  "yftq",
  "thzv",
  "dlip",
  "dgxw",
  "ayrd",
  "uomx",
  "lrwi",
  "jbrw",
  "gbzh",
  "xlxb",
  "qdkt",
  "aieh",
  "szwy",
  "ptkl",
  "qdht",
];

// Event handler for WebSocket open connection
socket.on("open", function () {
  console.log("WebSocket connection opened.");

  // Send each message with a delay
  streamData.forEach((message, index) => {
    setTimeout(() => {
      console.log(`Sending message: ${message}`);
      socket.send(message);
    }, index * 1000);
  });
});

// Event handler for WebSocket message received
socket.on("message", function (message) {
  console.log(`Message received from server: ${message}`);
});

// Event handler for WebSocket errors
socket.on("error", function (error) {
  console.error("WebSocket error:", error);
});

// Event handler for WebSocket connection closed
socket.on("close", function () {
  console.log("WebSocket connection closed.");
});
