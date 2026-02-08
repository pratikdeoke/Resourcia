import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://resourcia-frontend.netlify.app",
    ];

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use(express.json());
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

export default app;