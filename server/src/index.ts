import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });

import express from "express";
import { router } from "./routes/index.js";
import cors from "cors";
import http from "http";
import { setupWebSocket } from "./websocket/wsServer.js";

const app = express();


app.use(express.json());
app.use(cors());

app.use("/api/v1",router);

console.log("ENV KEY:", process.env.SECRET_API_KEY);
const PORT = 4000;


const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
});
