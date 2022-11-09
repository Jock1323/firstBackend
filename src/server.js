import express from "express"
import cors from "cors"
import { errorHandlerMiddleware } from "./middleware/errorHandler.middleware.js";
import videoRouter from "./routers/videos.router.js"
import userRouter from "./routers/users.router.js"
import { PORT } from "./utils/config.js";

const app=express();
app.use(cors())
// app.use(express.urlencoded())
app.use(express.json())
app.use(userRouter)
app.use(videoRouter)
app.use(errorHandlerMiddleware)
app.listen(PORT,console.log("hello from the server"))