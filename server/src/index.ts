import "dotenv/config";
import express from "express";
import { router } from "./routes/index.js";


const app = express();


app.use(express.json());
app.use("/api/v1",router);

console.log("ENV KEY:", process.env.SECRET_API_KEY);
const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`);
});

