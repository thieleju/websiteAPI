module.exports = (io, players, data) => {
  // add new player
  players.push(data);

  // emit update event to all clients
  io.emit("update_players", players);
};
