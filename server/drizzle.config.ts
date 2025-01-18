import type { Config } from "drizzle-kit";
import { config } from "./src/providers/config";

export default {
    dialect: "postgresql",
	dbCredentials: {
		url: config.node_env === "dev" ? config.database_uri_dev : config.database_uri_prod,
	},
	schema: "./src/db/schema.ts",
	out: config.node_env === "dev" ? "./src/db/migrations/dev" : "./src/db/migrations/prod",
} satisfies Config;
