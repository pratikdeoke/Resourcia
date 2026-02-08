import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors({
    origin: 'https://resourcia.vercel.app',
    credentials: true,
}));
app.use(express.json());
app.use("/api/v1", routes);

app.get("/", (req, res) => {
    res.send("Backend is running");
})

export default app;