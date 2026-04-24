const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379
  }
});

redisClient.on("error", (err) => console.log(`Redis error: ${err.message}`));

async function redisConnect() {
  await redisClient.connect();
  console.log("Redis connected!");
}

module.exports = { redisConnect, redisClient };