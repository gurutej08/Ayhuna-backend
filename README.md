**Ay-Hunnaa**
Real-Time Multiplayer Web Game

Ay-Huna is a real-time multiplayer card-style web game built using modern web technologies.
Players can create rooms, join matches, and play turn-based gameplay with live synchronization.

**Frontend :**
https://ay-hunna.vercel.app/

**Backend (Server API & Socket) :**
https://ayhuna-backend.onrender.com


## Tech Stack


## Frontend
  **React (Vite)**  
  **JavaScript**  
  **HTML5**  
  **CSS3**  
  **Socket.io Client**  

## Backend
  **Node.js**  
  **Express.js**  
  **Socket.io**  
  **CORS**  

  ---
## Project Repositories

**Frontend Repo**
  https://github.com/gurutej08/Ay-huna

**Backend Repo**
  https://github.com/gurutej08/Ayhuna-backend

  ---
  
## Features
    Real-time multiplayer gameplay
    Room creation & joining system
    Turn-based card logic
    Live game state updates
    Player connect & disconnect handling
   Cross-device multiplayer support

**How It Works**

A player opens the game in their browser.
The frontend automatically establishes a real-time connection with the backend server using Socket.io.
The player either creates a new game room or joins an existing one.
Once all players are in the room, the match begins.
When a player makes a move, the action is sent to the server.
The server processes the move and updates the game state.
The updated state is instantly broadcast to all players in that room.
Every player's UI refreshes in real time — ensuring everyone sees the same game state.

---

## Frontend-Backend Connection

Frontend connects using:

import { io } from "socket.io-client";

const socket = io("https://ayhuna-backend.onrender.com");




---

## Local Development Setup

**Clone Both Repositories**
git clone https://github.com/gurutej08/Ay-huna.git
git clone https://github.com/gurutej08/Ayhuna-backend.git

## Run Backend(cmd)
    cd Ayhuna-backend
    npm install
    node server.js
## Run Frontend(cmd)
    cd Ay-huna
    npm install
    npm run dev

 **Frontend runs on:**
http://localhost:5173

**Backend runs on:**
http://localhost:5000

## Deployment
Frontend deployed on Vercel
Backend deployed on Render
CORS enabled for frontend domain
Port configured using:
const PORT = process.env.PORT || 5000;


Gurutej Eslavath
Full Stack Developer
