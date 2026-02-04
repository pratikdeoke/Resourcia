import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});
console.log("REDIS_URL exists:", !!process.env.REDIS_URL);
console.log("REDIS_TOKEN exists:", !!process.env.REDIS_TOKEN);
export default redis;