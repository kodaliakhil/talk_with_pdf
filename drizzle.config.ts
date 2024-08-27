// import type { Config } from "drizzle-kit";
import { defineConfig } from 'drizzle-kit'
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// export default {
//   driver: "pg",
//   schema: "./src/lib/db/schema.ts",
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// } satisfies Config;

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})