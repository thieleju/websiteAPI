// is triggered by the "player-update" event

module.exports = (io, players, data) => {
  // find player by id
  let player = players.find((player) => player.id === data.id);

  // update position of player
  if (player) {
    player.position = data.position;
    // emit update event to all clients
    io.emit("update_players", players);
  }
};
