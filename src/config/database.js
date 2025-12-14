import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

if (process.env.NODE_ENV === 'development') {
    neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
    neonConfig.useSecureWebSocket = false;
    neonConfig.poolQueryViaFetch = true;
}


export { db, sql };