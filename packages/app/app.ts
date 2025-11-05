import { config } from "dotenv";
import { fribbit } from "dataviz-lib";
config();
console.log("Hello from...", process.env.WEBAPP_ENV);
console.log("format", fribbit(Date.now()));
