import express from "express"
import cors from "cors"
import {connection} from "./config/connect.js"
import taskRouter from "./routes/task_route.js";
import authRouter from "./routes/user_route.js";

const app = express()
app.use(express.json());
app.use(cors());
app.use('/task', taskRouter);
app.use('/auth', authRouter); 

app.listen(process.env.PORT, async()=>{
  connection();
    console.log(`Port is Running at ${process.env.PORT}`, "http://localhost:3000/");
})