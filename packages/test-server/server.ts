import { config } from "dotenv";
config();
console.log("Hello from...", process.env.SERVER_ENV);
