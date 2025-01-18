import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { config } from "../providers/config";
import postgres from "postgres";

const query_client = postgres(config.node_env === "dev" ? config.database_uri_dev : config.database_uri_prod);
export const DB = drizzle(query_client, { schema });