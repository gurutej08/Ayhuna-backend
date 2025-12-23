const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: "https://ay-hunna.vercel.app", 
    methods: ["GET", "POST"]

  },
});

app.get("/", (req, res) => {
  res.send("Ayhuna backend is running 🚀");
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // CREATE ROOM
  socket.on("create-room", ({ player, roomcode, chitti }) => {
    if (rooms[roomcode]) {
      socket.emit("room-error", "Room already exists");
      return;
    }

    rooms[roomcode] = {
      host: player,
      players: [{ id: socket.id, name: player, chitti: [] }],
      gameOver: false,
      winner: null,
    };

    socket.join(roomcode);

    console.log("Rooms:", rooms);

    socket.emit("room-created", {
      roomcode,
      host: player,
    });

    io.to(roomcode).emit("room-update", rooms[roomcode]);
  });

  // JOIN ROOM
  socket.on("join-room", ({ player, roomcode, chitti }) => {
    if (!player) return;
    const room = rooms[roomcode];
    if (!room) return;

    if (!room.players.find((p) => p.name === player)) {
      room.players.push({ id: socket.id, name: player, chitti: [] });
    }

    socket.join(roomcode);
    console.log(room.players);

    io.to(roomcode).emit("room-update", room);
  });

  // add my chittis
  socket.on("chitti-into", ({ player, roomcode, chitti, ishost }) => {
    const room = rooms[roomcode];
    if (!room || room.gameOver) return;

    room.players.forEach((p) => {
      p.chitti.push(chitti);
      if (p.name === room.host && ishost) {
        p.chitti.push(chitti);
      }
    });

    io.to(roomcode).emit("room-update", room);
  });

  // passing chittis
  socket.on("pass-chitti", ({ roomcode, player, index }) => {
    if (index === null || index === undefined) return;

    const room = rooms[roomcode];
    if (!room || room.gameOver) return;

    const chittiIndex = index;
    const playerIndex = room.players.findIndex(
      (p) => p.name === player
    );
    if (playerIndex === -1) return;

    const chitti = room.players[playerIndex].chitti[chittiIndex];
    if (!chitti) return;

    const nextplayerindex =
      (playerIndex + 1) % room.players.length;
    const nextplayer = room.players[nextplayerindex].name;

    room.players[nextplayerindex].chitti.push(chitti);
    room.players[playerIndex].chitti.splice(chittiIndex, 1);

    io.to(roomcode).emit("next-player", {
      nextplayer,
      chitti,
    });

    io.to(roomcode).emit("room-update", room);
  });

  // checking for winner condition
  socket.on("winner-check", (data) => {
    const { roomcode, player } = data;
    if (!player) return;

    const room = rooms[roomcode];
    if (!room) return;

    if (room.gameOver) {
      socket.emit("not-winner", "Game already finished");
      return;
    }

    const playerData = room.players.find((p) => p.name === player);
    if (!playerData) return;

    if (playerData.chitti.length !== 4) {
      socket.emit("not-winner", "you must have exactly 4 chittis");
      return;
    }

    const allSame = playerData.chitti.every(
      (chitti) => chitti === playerData.chitti[0]
    );

    if (allSame) {
      room.gameOver = true;
      room.winner = player;

      io.to(roomcode).emit("game-over", {
        winner: player,
      });

      setTimeout(() => {
        delete rooms[roomcode];
      }, 10000);
    } else {
      socket.emit("not-winner", "Not all chittis are same");
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
