import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { config } from "../providers/config";

const migration_client = postgres(config.node_env === "dev" ? config.database_uri_dev : config.database_uri_prod, { max: 1 });

export const main = async () => {
    try {
        await migrate(drizzle(migration_client), {
            migrationsFolder: config.node_env === "dev" ? "./src/db/migrations/dev" : "./src/db/migrations/prod",
        });
        console.log("Migrations complete!");
        await migration_client.end();
        process.exit(0);
    } catch (err) {
        console.error("Migrations failed!", err);
        await migration_client.end();
        process.exit(1);
    }
};

main();
