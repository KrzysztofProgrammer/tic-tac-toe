import express from 'express';
import http from 'http';
import { serveSite } from "./serveSite";
import { serveGame } from "./serveGame";

const app = express();
const server = http.createServer(app);

serveGame(server);

serveSite(app);

server.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});