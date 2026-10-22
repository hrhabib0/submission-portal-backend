import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
    node_env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    frontend_url: process.env.FRONTEND_URL,
};