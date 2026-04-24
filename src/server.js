require("dotenv").config();
const express = require("express");
const mainRouter = require("./routes/main.routes");
const dbConnection = require("./lib/db.service");
const { redisConnect } = require("./lib/redis.service");

redisConnect().catch(()=> process.exit(1));
dbConnection().catch(()=> process.exit(1))

const app = express();
app.use(express.json());

app.use("/api", mainRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}-port`));