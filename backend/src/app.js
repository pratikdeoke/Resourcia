import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import dns from 'dns';

const app = express();

app.use(cors({
    origin: 'https://resourcia.vercel.app',
    credentials: true,
}));
app.use(express.json());
app.use("/api/v1", routes);

app.get('/test-dns', (req, res) => {
  dns.lookup(process.env.DB_HOST, (err, address) => {
    if (err) return res.status(500).send(err.message);
    res.send(`DB resolves to ${address}`);
  });
});

app.get("/", (req, res) => {
    res.send("Backend is running");
})

export default app;