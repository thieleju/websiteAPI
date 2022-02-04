const handlePlayerUpdate = require("./handlePlayerUpdate");
const handlePlayerJoin = require("./handlePlayerJoin");

var clients = [];
var players = [];

module.exports = (io) => {
  io.on("connection", (socket) => handleConnection(io, socket));
};

/**
 * Handle client connection
 * @param {Object} io socket.io instance
 * @param {Object} socket Created socket
 */
function handleConnection(io, socket) {
  // add connected user to clients
  clients.push({ id: socket.id, ip: socket.handshake.address });
  logConnect(socket);

  socket.on("request_id", () => handleRequestID(io, socket));

  socket.on("player_join", (data) => handlePlayerJoin(io, players, data));

  socket.on("player_update", (data) => handlePlayerUpdate(io, players, data));

  socket.on("message", (text) => console.log(text));

  socket.on("disconnect", () => handleDisconnect(io, socket));
}

function handleRequestID(io, socket) {
  return io.to(socket.id).emit("answer_id", socket.id);
}

function handleDisconnect(io, socket) {
  // remove disconnected client from clients
  clients = clients.filter((client) => client.id !== socket.id);
  players = players.filter((player) => player.id !== socket.id);

  // tell everyone that a client disconnected
  io.emit("player_leave", socket.id);

  // user disconnected
  logDisconnect(socket);
}

function logConnect(socket) {
  console.log(
    "🟢",
    socket.handshake.address,
    " connected:",
    socket.id,
    " | ",
    clients.length
  );
}

function logDisconnect(socket) {
  console.log(
    "🔴",
    socket.handshake.address,
    " disconnected:",
    socket.id,
    " | ",
    clients.length
  );
}
